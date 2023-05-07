import { Component, ElementRef } from '@angular/core';
import { CameraService } from '../camera/camera.service';
import { Photo } from '@capacitor/camera';
import { BehaviorSubject, Subscription, lastValueFrom } from 'rxjs';
import { TermResponse, TermsService } from '../services/terms.service';
import { ViewChild } from '@angular/core';
import { IonImg, IonModal, LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-terms',
	templateUrl: 'terms.page.html',
	styleUrls: ['terms.page.scss'],
})
export class TermsPage {
	constructor(
		private camService: CameraService,
		private termService: TermsService,
		private loadingCtrl: LoadingController
	) {}

	photo$ = this.camService.termsPhoto$;

	ngOnInit() {
		this.photo$.subscribe(async (photo) => {
			if (!photo) {
				return;
			}
			await this.annotate(photo);
		});
	}

	@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

	async takePhoto() {
		await this.camService.takePhotoTerms();
	}

	loading = false;

	async annotate(photo: Photo) {
		const loading = await this.loadingCtrl.create({
			message: 'Processing image...',
			duration: 3000,
		});

		await loading.present();
		const annos = await this.termService.getAnnotations(photo);
		console.log(annos);
		if (!annos) {
			return;
		}
		const { width, height } = annos.metadata;
		const canvas = this.canvas.nativeElement;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d')!;
		ctx.clearRect(0, 0, width, height);
		const image = new Image();
		image.src = photo.dataUrl!;
		image.onload = () => {
			ctx.drawImage(image, 0, 0, width, height);
			ctx.strokeStyle = '#FF0000';
			ctx.lineWidth = 5;
			ctx.fillStyle = '#FF0000';
			ctx.font = 'bold 18px Arial';

			for (const annotation of annos.objects) {
				ctx.strokeRect(
					annotation.boundingBox.x,
					annotation.boundingBox.y,
					annotation.boundingBox.w,
					annotation.boundingBox.h
				);

				ctx.fillStyle = '#FF0000';
				ctx.font = 'bold 20px Arial';
				ctx.fillText(
					annotation.tags[0].name,
					annotation.boundingBox.x,
					annotation.boundingBox.y - 5
				);

				ctx.fillStyle = '#FFFFFF';
				const x =
					annotation.boundingBox.x + annotation.boundingBox.w / 2;
				const y =
					annotation.boundingBox.y + annotation.boundingBox.h / 2;
				ctx.fillText(annotation.tags[0].darija, x, y);
			}
			loading.dismiss();
		};
	}
}
