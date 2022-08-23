import AWS from 'aws-sdk';
import { error } from '@sveltejs/kit';
import { USERPOOLID, REGION } from '$env/static/private';

export async function load({ locals }) {
	if (!locals.usergroups.includes('admins')) {
		return error(403, 'Access forbidden.');
	}
	const cognito = new AWS.CognitoIdentityServiceProvider({ region: REGION });
	const { Users: users } = await cognito.listUsers({ UserPoolId: USERPOOLID }).promise();

	return {
		users: [...users?.map((x) => ({ username: x.Username, enabled: x.Enabled }))]
	};
}
