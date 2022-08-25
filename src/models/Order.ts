export interface Order {
	id?: string;
	type: 'order';
	taskToken?: string;
	updatedAt?: string;
	executionArn?: string;
	updatedBy?: string;
}
