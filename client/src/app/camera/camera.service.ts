import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo, } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { TermsService } from '../services/terms.service';

@Injectable({ providedIn: 'root' })
export class CameraService {
	constructor(
		private platform: Platform,
		private termsService: TermsService
	) {}
	private _guidePhoto$ = new BehaviorSubject<Photo | null>(null);
	guidePhoto$ = this._guidePhoto$.asObservable();

	private _termsPhoto$ = new BehaviorSubject<Photo | null>(null);
	termsPhoto$ = this._termsPhoto$.asObservable();

	async takePhotoGuide() {
		const options: ImageOptions = {
			quality: 50,
			width: 600,
			allowEditing: false,
			resultType: this.platform.is('capacitor')
				? CameraResultType.Uri
				: CameraResultType.DataUrl,
			source: CameraSource.Camera,
		};

		try {
			const photo = await Camera.getPhoto(options);
			this._guidePhoto$.next(photo);
		} catch (err) {
			console.log(err);
		}
	}

	async takePhotoTerms() {
		const options: ImageOptions = {
			width: 600,
			allowEditing: false,
			resultType: this.platform.is('capacitor')
				? CameraResultType.Uri
				: CameraResultType.DataUrl,
			source: CameraSource.Camera,
		};

		try {
			// 	const annos = await this.termsService.getAnnotations(photo);
		// 	if (!annos) {
		// 		return;
		// 	}
		// 	const { width, height } = annos.metadata;
		// 	const canvas = document.getElementById(
		// 		'canva'
		// 	) as HTMLCanvasElement;
		// 	const ctx = canvas.getContext('2d')!;
		// 	ctx.clearRect(0, 0, width, height);
		//
		// 	ctx.strokeStyle = '#FF0000';
		// 	ctx.lineWidth = 5;
		//
		// 	ctx.fillStyle = '#FF0000';
		// 	ctx.font = 'bold 18px Arial';
		//
		// 	for (const annotation of annos.objects) {
		// 		ctx.strokeRect(
		// 			annotation.boundingBox.x,
		// 			annotation.boundingBox.y,
		// 			annotation.boundingBox.w,
		// 			annotation.boundingBox.h
		// 		);
		//
		// 		// Draw label 1
		// 		ctx.fillStyle = '#FF0000';
		// 		ctx.font = 'bold 20px Arial';
		// 		ctx.fillText(
		// 			annotation.tags[0].name,
		// 			annotation.boundingBox.x,
		// 			annotation.boundingBox.y - 5
		// 		);
		//
		// 		// Draw label 2
		// 		ctx.fillStyle = '#FFFFFF';
		// 		const x =
		// 			annotation.boundingBox.x + annotation.boundingBox.w / 2;
		// 		const y =
		// 			annotation.boundingBox.y + annotation.boundingBox.h / 2;
		// 		ctx.fillText(annotation.tags[0].darija, x, y);
		// 	}
		//
		// 	const dataUrl = await canvas.toDataURL('image/jpeg', 1);
		//
		// 	this._termsPhoto$.next(dataUrl);
		//
		// 	(document.getElementById('img-terms') as HTMLImageElement).src =
		// 		dataUrl;
			const photo = await Camera.getPhoto(options);
			this._termsPhoto$.next(photo);
		} catch (err) {
			console.log(err);
		}
	}
}
