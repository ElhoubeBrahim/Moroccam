import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Facts } from "./facts.service";
import { StateService } from "../state.service";
import { HttpClient } from "@angular/common/http";

export interface TermResponse {
	objects: Object[];
	metadata: Metadata;
}
export interface Object {
	boundingBox: BoundingBox;
	tags: Tag[];
}
export interface BoundingBox {
	x: number;
	y: number;
	w: number;
	h: number;
}
export interface Tag {
	name: string;
	darija: string;
	confidence: number;
}
export interface Metadata {
	width: number;
	height: number;
}

@Injectable({
	providedIn: 'root',
})
export class TermsService {
	constructor(private state: StateService, private http: HttpClient) { }
	async getAnnotations(photo: Photo): Promise<TermResponse | undefined> {
		const blob = await fetch(photo.dataUrl!).then(r => r.blob());
		const formData = new FormData();
		formData.append('image', blob);
		try {
			const lang = this.state.langCode;
			if (!lang) {
				return undefined;
			}
			return await this.http.post<TermResponse>(`http://localhost:8000/objects?lang=${lang}`, formData).toPromise();
		} catch (error) {
			return undefined;
		}
	}
}
