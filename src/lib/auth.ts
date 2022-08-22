import {
	CognitoUser,
	CognitoUserPool,
	AuthenticationDetails,
	CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import { USERPOOLID, USERPOOLCLIENTID } from '$env/static/private';

export const userPool =
	USERPOOLID && USERPOOLCLIENTID
		? new CognitoUserPool({
				UserPoolId: USERPOOLID,
				ClientId: USERPOOLCLIENTID
		  })
		: null;

export async function signIn(username: string, password: string) {
	const user = new CognitoUser({
		Username: username,
		Pool: userPool!
	});
	const authDetails = new AuthenticationDetails({
		Username: username,
		Password: password
	});
	return new Promise((resolve, reject) => {
		user.authenticateUser(authDetails, {
			onSuccess: resolve,
			onFailure: reject,
			newPasswordRequired: (data) => {
				console.log('newPasswordRequired', data);
			}
		});
	});
}

export async function signUp(username: string, password: string) {
	return new Promise((resolve, reject) => {
		userPool!.signUp(
			username,
			password,
			[new CognitoUserAttribute({ Name: 'email', Value: username })],
			[],
			(err, data) => {
				if (err) return reject(err);

				return resolve(data);
			}
		);
	});
}

export async function verifyUser(username: string, code: string) {
	const user = new CognitoUser({
		Username: username,
		Pool: userPool!
	});
	return new Promise<void>((resolve, reject) => {
		user.confirmRegistration(code, false, (error, data) => {
			if (error) return reject(error);

			resolve(data);
		});
	});
}

export async function signOut(username: string) {
	return new Promise<void>((resolve) => {
		userPool?.getCurrentUser()?.signOut(() => resolve());
	});
}

export async function resetPassword(username: string, oldPassword: string, newPassword: string) {
	return new Promise((resolve, reject) => {
		userPool?.getCurrentUser()?.changePassword(oldPassword, newPassword, (error, data) => {
			if (error) return reject(error);
			resolve(data);
		});
	});
}
