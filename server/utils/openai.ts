import { Configuration, OpenAIApi } from "openai";
import { Object } from "../interface/DetectObjectsResponse";

// OpenAI API configuration
const openai = new OpenAIApi(
	new Configuration({
		apiKey: "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",
	})
);

// Data for translation from English to Darija
const translationData = {
	"person": "bnadem",
	"coffee": "Qahwa",
	"car": "tomobile",
	"bottle": "Qraa",
	"chair": "korsi",
	"shoe": "sabat",
};

/**
 * Generate the prompt for the OpenAI API
 *
 * @param {string} placeName
 * @param {string} lang
 * @returns string
 */
const generatePrompt = (placeName: string, lang: string): string => {
	return `Please create a JSON object with the following schema: "description": "string", "info": ["info1", "info2", "info3"], "activities": [{"name": "string", "description": "string"}].
    The object should contain information about the place specified by ${placeName} in ${lang} language. Please do not include any additional explanations, and return the object in JSON format.`;
};

/**
 * Get the description and facts about a place using OpenAI API
 *
 * @param {string} placeName
 * @param {string} lang
 * @returns object
 */
export async function getPlaceDescription(placeName: string, lang: string) {
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: generatePrompt(placeName, lang),
			temperature: 0,
			max_tokens: 4000,
		});

		const text = response.data.choices[0].text;
		return {
			success: true,
			data: text ? JSON.parse(text) : null,
		};
	} catch (error) {
		return {
			success: false,
			error,
		};
	}
}

export async function translateObjectNamesToDarija(
	objects: Object[],
	lang: string
) {
	// Get the names of the objects in order
	const objectNames = objects.map((object) => {
		return object.tags[0].name;
	});

	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `As a Moroccan darija native speaker, please translate the following ${lang} words to darija using only Latin letters. Do not provide any additional information. The words are: ${objectNames.join(
				","
			)}. List the translations in the same order separated by commas. Use this dictionnary: ${JSON.stringify(translationData)}.`,
			temperature: 0,
			max_tokens: 4000,
		});

		const text = response.data.choices[0].text;
		if (text === "") {
			throw new Error("No text returned from OpenAI API");
		}

		return objects.map((object, index) => {
			return {
				boundingBox: object.boundingBox,
				tags: [
					{
						name: object.tags[0].name,
						darija: text?.trim().split(",")[index],
						confidence: object.tags[0].confidence,
					},
				],
			};
		});
	} catch (error) {
		return {
			success: false,
			error,
		};
	}
}
