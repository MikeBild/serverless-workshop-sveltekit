import type { PageServerLoad } from './$types';
import AWS from 'aws-sdk';
import { error } from '@sveltejs/kit';
import { AWS_REGION, TABLENAME } from '$env/static/private';
import type { Task } from '$models/User';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}
	const ddb = new AWS.DynamoDB({ region: AWS_REGION });
	const { Items } = await ddb
		.scan({
			TableName: TABLENAME,
			ConsistentRead: true,
			FilterExpression: '#d0a30 = :d0a30',
			ExpressionAttributeValues: {
				':d0a30': {
					S: 'task'
				}
			},
			ExpressionAttributeNames: {
				'#d0a30': 'type'
			}
		})
		.promise();

	return {
		tasks: Items?.map((x) => AWS.DynamoDB.Converter.unmarshall(x))
	};
};
