import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class GeolocationService {

	async getCurrentPosition() {
		return await Geolocation.getCurrentPosition();
	}

}
