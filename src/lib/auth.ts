import AWS from 'aws-sdk';
import { USERPOOLCLIENTID, AWS_REGION } from '$env/static/private';

const cognito = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });

export function signIn(username: string, password: string) {
	return cognito
		.initiateAuth({
			AuthFlow: 'USER_PASSWORD_AUTH',
			ClientId: USERPOOLCLIENTID,
			AuthParameters: {
				USERNAME: username,
				PASSWORD: password
			}
		})
		.promise();
}

export function signUp(username: string, password: string) {
	return cognito
		.signUp({
			ClientId: USERPOOLCLIENTID,
			Username: username,
			Password: password,
			ValidationData: [{ Name: 'email', Value: username }]
		})
		.promise();
}

export function verifyUser(username: string, code: string) {
	return cognito
		.confirmSignUp({
			ClientId: USERPOOLCLIENTID,
			Username: username,
			ConfirmationCode: code
		})
		.promise();
}

export function signOut(accessToken?: string) {
	return cognito.globalSignOut({ AccessToken: accessToken! }).promise();
}
