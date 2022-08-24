import type { ExternalFetch, Handle, HandleError } from '@sveltejs/kit';
import { parse } from 'cookie';
import { decode, type JwtPayload } from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = parse(event.request.headers.get('cookie') || '');
	const payload = decode(cookie.token) as JwtPayload;

	event.locals.accessToken = cookie.token;
	event.locals.username = payload?.username;
	event.locals.usergroups = payload ? payload['cognito:groups'] : undefined;

	return await resolve(event);
};

export const handleError: HandleError = async ({ error, event }) => {
	// send error to an error tracking service
};

export const externalFetch: ExternalFetch = async (request) => {
	// add some authorization headers etc.
	return fetch(request);
};
