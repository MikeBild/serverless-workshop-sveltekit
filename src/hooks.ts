import type { ExternalFetch, Handle, HandleError } from '@sveltejs/kit';
import { parse } from 'cookie';
import { decode, type JwtPayload } from 'jsonwebtoken';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { USERPOOLID } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = parse(event.request.headers.get('cookie') || '');
	const token = cookie.token;
	const payload = decode(token) as JwtPayload;
	const groups = payload ? payload['cognito:groups'] : undefined;
	const clientId = payload?.client_id as string;
	const username = payload?.username;

	try {
		const verifier = CognitoJwtVerifier.create({
			userPoolId: USERPOOLID,
			tokenUse: 'access'
		});
		const payload = await verifier.verify(token, { clientId, groups });

		event.locals.accessToken = token;
		event.locals.username = username;
		event.locals.usergroups = groups;
	} catch {
		event.locals.accessToken = undefined;
		event.locals.username = undefined;
		event.locals.usergroups = undefined;
	}

	return await resolve(event);
};

export const handleError: HandleError = async ({ error, event }) => {
	// send error to an error tracking service
};

export const externalFetch: ExternalFetch = async (request) => {
	// add some authorization headers etc.
	return fetch(request);
};
