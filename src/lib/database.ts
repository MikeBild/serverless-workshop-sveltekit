import AWS from 'aws-sdk';
import { TABLENAME } from '$env/static/private';

const ddb = new AWS.DynamoDB();

export interface Item {
	id: string;
	type: string;
}

export async function list<T>(type: string): Promise<T[] | undefined> {
	const { Items } = await ddb
		.scan({
			TableName: TABLENAME,
			ConsistentRead: true,
			FilterExpression: '#d0a30 = :d0a30',
			ExpressionAttributeValues: {
				':d0a30': {
					S: type
				}
			},
			ExpressionAttributeNames: {
				'#d0a30': 'type'
			}
		})
		.promise();

	return Items?.map((x) => AWS.DynamoDB.Converter.unmarshall(x) as T);
}

export async function upsert(item: Item): Promise<void> {
	await ddb
		.putItem({
			TableName: TABLENAME,
			Item: AWS.DynamoDB.Converter.marshall({
				...item,
				updatedAt: new Date().toUTCString()
			})
		})
		.promise();
}

export async function remove(type: string, id: string): Promise<void> {
	await ddb
		.deleteItem({
			TableName: TABLENAME,
			Key: AWS.DynamoDB.Converter.marshall({ id, type })
		})
		.promise();
}
