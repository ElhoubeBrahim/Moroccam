export interface LocationResponse {
	address_components: {
		long_name: string;
		short_name: string;
		types: string[];
	}[];
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
	};
	name: string;
	photos: {
		height: number;
		html_attributions: string[];
		photo_reference: string;
		width: number;
	}[];
	place_id: string;
	rating: number;
	types: string[];
	url: string;
	vicinity: string;
}
