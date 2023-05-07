import { Request, Response } from "express";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import Busboy from "busboy";
import { getPlaceName, predictPlaceFromImage } from "../utils/tensorflow";
import { getPlaceDescription } from "../utils/openai";
import { getPlaceGeoinfo } from "../utils/maps";
import { DetectPlaceResponse } from "../interface/DetectPlaceResponse";

/**
 * Get the place information from the place name (description, geo-location, images, activities)
 *
 * @param {string} placeName
 * @param {string} lang
 * @returns object
 */
async function getPlaceInfo(placeName: string, lang: string) {
	const results = await Promise.all([
		getPlaceDescription(placeName, lang),
		getPlaceGeoinfo(placeName),
	]);

	return {
		...(results[0].success ? results[0].data : {}),
		...results[1],
	};
}

export const detectPlace = async (req: Request, res: Response) => {
	// Setup Busboy
	const busboy = Busboy({ headers: req.headers });
	const fileWrites: Promise<unknown>[] = [];
	const tmpdir = os.tmpdir();

	// Init data objects
	const lang = (req.query.lang as string) || "en";
	const files: Record<string, string> = {};

	// Parse uploaded files
	req.pipe(busboy);
	busboy.on("file", (fieldname, file, { filename }) => {
		filename = `${Date.now()}-${filename}`;
		const filepath = path.join(tmpdir, filename);
		files[fieldname] = filepath;

		const writeStream = fs.createWriteStream(filepath);
		file.pipe(writeStream);

		const promise = new Promise((resolve, reject) => {
			file.on("end", () => {
				writeStream.end();
			});
			writeStream.on("close", resolve);
			writeStream.on("error", reject);
		});
		fileWrites.push(promise);
	});

	// Run once the files are processed
	busboy.on("finish", async () => {
		await Promise.all(fileWrites);

		// Predict place from image
		const predictions = await predictPlaceFromImage(files.image);
		const placeName = getPlaceName(predictions);

		// If no place is found, return error
		if (placeName === "Unknown") {
			return res.status(404).json({ error: "Place not found" });
		}

		// Get place information (description, geo-location, images, activities)
		const placeInfo = await getPlaceInfo(placeName, lang);

		// Delete files from tmp folder
		for (const file in files) {
			fs.unlinkSync(files[file]);
		}

		// Return response
		res.send(
			new DetectPlaceResponse({
				name: placeName,
				...placeInfo,
			})
		);
	});
};
