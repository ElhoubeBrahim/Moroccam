import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";

// Define helper variables
const modelUrl = "https://storage.googleapis.com/tm-model/RFSqeWi65/model.json";
const labels = [
	"Koutoubia Mosque",
	"Bab Mansour",
	"Hassan Tower",
	"Al-Qarawiyyin",
	"Jamaa El Fna",
	"El Badi Palace",
	"Almoravid Koubba",
	"Bab Bou Jeloud",
	"Bin el Ouidane Dam",
	"Caves of Hercules",
	"Saint Peter Cathedral Rabat",
];

/**
 * Predict the place from an image using TensorFlow.js
 *
 * @param {string} image
 * @returns array[integer]
 */
export async function predictPlaceFromImage(image: string) {
	// Load the model
	const model = await tf.loadLayersModel(modelUrl);

	// Prepare the image for prediction
	const content = fs.readFileSync(image, { encoding: "base64" });
	const imageBuffer = Buffer.from(content, "base64");
	const decodedImage = tf.node.decodeImage(imageBuffer);
	const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
	const processedImage = resizedImage.reshape([1, 224, 224, 3]);

	// Predict the place
	const predictions = model.predict(processedImage) as tf.Tensor;
	return predictions.dataSync();
}

/**
 * Get the place name from the predictions
 *
 * @param {array[integer]} predictions
 * @returns string
 */
export function getPlaceName(predictions: Float32Array | Int32Array | Uint8Array) {
	const max = Math.max(...predictions);
	const index = predictions.indexOf(max);
	return max > 0.5 ? labels[index] : "Unknown";
}
