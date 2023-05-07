import axios from "axios";
import * as fs from "fs";
import { TermResponse } from "../interface/DetectObjectsResponse";

const subscriptionKey = "6504855e3d0f4e25be2d5546125fd159";
const url =
	"https://object-identifier.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects";

export async function getDetections(image: string): Promise<TermResponse> {
	const content = fs.readFileSync(image);
	const response = await axios.post(url, content, {
		headers: {
			"Ocp-Apim-Subscription-Key": subscriptionKey,
			"Content-Type": "application/octet-stream",
		},
	});

	const result = response.data;
	const objects = result.objectsResult.values;

	return {
		objects: objects.map((object: any) => {
			return {
				boundingBox: object.boundingBox,
				tags: object.tags.map((tag: any) => {
					return {
						name: tag.name,
						darija: "",
						confidence: tag.confidence,
					};
				}),
			};
		}),
		metadata: result.metadata,
	};
}
