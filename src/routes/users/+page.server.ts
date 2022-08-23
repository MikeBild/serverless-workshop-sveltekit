import type { PageServerLoad } from './$types';
import AWS from 'aws-sdk';
import { error } from '@sveltejs/kit';
import { USERPOOLID, AWS_REGION } from '$env/static/private';
import type { User } from '$models/User';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}
	const cognito = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });
	const { Users: users } = await cognito.listUsers({ UserPoolId: USERPOOLID }).promise();

	return {
		users: users?.map<User>((x) => ({ username: x.Username, enabled: x.Enabled }))
	};
};
