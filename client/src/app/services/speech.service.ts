import { Injectable } from "@angular/core";
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({ providedIn: 'root' })
export class SpeechService {
	private speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
		'870301d156fe4c29a55f021a786f0ca8', 'westeurope'
	);

	private synthesizer =
		new SpeechSDK.SpeechSynthesizer(this.speechConfig);

	public speak(text: string) {
		this.synthesizer.speakTextAsync(text);
	}


}
