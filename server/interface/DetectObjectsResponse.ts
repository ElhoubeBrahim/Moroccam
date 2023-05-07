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
