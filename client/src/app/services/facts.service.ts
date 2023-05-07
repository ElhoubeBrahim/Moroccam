import { Injectable } from "@angular/core";
import { Photo } from "@capacitor/camera";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs";
import { StateService } from "../state.service";

interface MapLocation {
	lat: number;
	lng: number;
}

export interface Facts {
	name: string;
	description: string;
	info: string[];
	city: string;
	images: string[];
	location: MapLocation;
	restaurants: Restaurant[];
	activities: Activity[];
	hotels: Hotel[];
}


export interface Restaurant {
	name: string;
	description: string;
	rating: number;
	image : string;
}

export interface Activity {
	name: string;
	description: string;
}

export interface Hotel {
	name: string;
	description: string;
	stars: number;
	image : string;
}
@Injectable({ providedIn: 'root' })
export class FactsService {

	constructor(private http: HttpClient, private state: StateService) { }
	async getFactsFromPhoto(photo: Photo) {
		const blob = await fetch(photo.dataUrl!).then(r => r.blob());
		const formData = new FormData();
		formData.append('image', blob);
		try {
			const lang = this.state.langCode;
			if (!lang) {
				return undefined;
			}
			return await this.http.post<Facts>(`http://localhost:8000/place?lang=${lang}`, formData).toPromise();
		} catch (error) {
			return undefined;
		}
	}
}
