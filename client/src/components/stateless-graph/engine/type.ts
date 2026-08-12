export interface Point {
	x: number;
	y: number;
}

export interface Rectangle {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;
}
