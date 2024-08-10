export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function getRandomElementFromArray(array: any[]): Promise<any> {
	return array[Math.floor(Math.random() * array.length)];
}
