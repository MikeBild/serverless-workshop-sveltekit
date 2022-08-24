import type { PageServerLoad } from './$types';
import AWS from 'aws-sdk';
import { error } from '@sveltejs/kit';
import { USERPOOLID, AWS_REGION } from '$env/static/private';
import type { Task } from '$models/User';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}
	const ddb = new AWS.DynamoDB({ region: AWS_REGION });
	const result = await ddb.scan().promise();
	console.log(result);
	
	return {
		tasks: []
	};
};
