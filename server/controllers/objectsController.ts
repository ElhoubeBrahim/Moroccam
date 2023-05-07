import { Request, Response } from "express";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import Busboy from "busboy";
import { getDetections } from "../utils/azure";
import { translateObjectNamesToDarija } from "../utils/openai";

export const detectObjects = async (req: Request, res: Response) => {
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

		// Detect objects from image
		const objects = await getDetections(files.image);
		const result = await translateObjectNamesToDarija(objects.objects, lang);

		// Delete files from tmp folder
		for (const file in files) {
			fs.unlinkSync(files[file]);
		}

		// Return response
		res.send({
			objects: result,
			metadata: objects.metadata,
		});
	});
};
