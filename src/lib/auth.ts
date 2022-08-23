import {
	CognitoUser,
	CognitoUserPool,
	AuthenticationDetails,
	CognitoUserAttribute,
	CognitoUserSession,
	type ISignUpResult
} from 'amazon-cognito-identity-js';
import { USERPOOLID, USERPOOLCLIENTID } from '$env/static/private';

export const userPool =
	USERPOOLID && USERPOOLCLIENTID
		? new CognitoUserPool({
				UserPoolId: USERPOOLID,
				ClientId: USERPOOLCLIENTID
		  })
		: undefined;

export async function signIn(
	username: string,
	password: string
): Promise<CognitoUserSession | undefined> {
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
			newPasswordRequired: reject
		});
	});
}

export async function signUp(
	username: string,
	password: string
): Promise<ISignUpResult | undefined> {
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

export async function verifyUser(code: string): Promise<any | undefined> {
	return new Promise<void>((resolve, reject) => {
		const user = userPool?.getCurrentUser();
		if (!user) return reject(new Error('User is not logged in.'));

		user.confirmRegistration(code, false, (error, data) => {
			if (error) return reject(error);

			resolve(data);
		});
	});
}

export async function signOut() {
	return new Promise<void>((resolve) => {
		userPool?.getCurrentUser()?.signOut(() => resolve());
	});
}

export async function getSession(): Promise<CognitoUserSession | undefined> {
	return new Promise((resolve, reject) => {
		const user = userPool?.getCurrentUser();
		if (!user) return reject(new Error('User is not logged in.'));

		user.getSession((error: Error | null, session: CognitoUserSession | undefined) => {
			if (error) return reject(error);
			resolve(session);
		});
	});
}

export async function getCurrentUserGroups(): Promise<string[] | undefined> {
	const session = await getSession();
	return session?.getAccessToken().payload['cognito:groups'];
}

export async function getCurrentUsername(): Promise<string | undefined> {
	return new Promise((resolve, reject) => {
		const user = userPool?.getCurrentUser()?.getUsername();
		if (!user) return reject(new Error('User is not logged in.'));

		resolve(user);
	});
}

export async function resetPassword(oldPassword: string, newPassword: string) {
	return new Promise((resolve, reject) => {
		const user = userPool?.getCurrentUser();
		if (!user) return reject(new Error('User is not logged in.'));

		user.changePassword(oldPassword, newPassword, (error, data) => {
			if (error) return reject(error);
			resolve(data);
		});
	});
}
