import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { StateService } from "../state.service";
import { Photo } from '@capacitor/camera';
import { CameraService } from "../camera/camera.service";
import { Subscription } from "rxjs";
import { IonModal } from "@ionic/angular";
import { Facts, FactsService } from "../services/facts.service";


import { DomSanitizer } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';
import { SpeechService } from "../services/speech.service";

register();


@Component({
	selector: 'app-guide',
	templateUrl: 'guide.page.html',
	styleUrls: ['guide.page.scss'],
})
export class GuidePage implements OnInit, OnDestroy {

	constructor(private state: StateService,
				private camService: CameraService,
				private sanitizer: DomSanitizer,
				private speech: SpeechService,
				private factsService: FactsService) {}

	lang$ = this.state.lang$;
	photo$ = this.camService.guidePhoto$;
	facts: Facts | null = null;

	@ViewChild('modal') modal!: IonModal;

	async takePhoto() {
		await this.camService.takePhotoGuide();
	}

	photoSubscription?: Subscription;
	ngOnInit() {
		this.photoSubscription = this.photo$.subscribe(
			async (photo: Photo | null) => {
				if (photo) {
					this.facts = await this.factsService.getFactsFromPhoto(photo) ?? null;
					this.facts && this.speech.speak(this.facts.description);
				}
			}
		);
	}

	ngOnDestroy(): void {
		if (this.photoSubscription && !this.photoSubscription.closed) {
			this.photoSubscription.unsubscribe();
		}
	}

	async imageLoaded(modal: IonModal) {
		await modal.present();
	}

	url = this.sanitizer.bypassSecurityTrustResourceUrl(
		`https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=${this.facts?.name}&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`
	);

	getRating = (rating: number) => {
		return Array.from({ length: rating }, (_, i) => `Element ${i + 1}`);
	};


}
