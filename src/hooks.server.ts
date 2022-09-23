import { verifyJwt } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { decode, type JwtPayload } from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = parse(event.request.headers.get('cookie') || '');
	if (!cookie.token) return await resolve(event);

	const accessToken = cookie.token;
	const payload = decode(accessToken) as JwtPayload;
	const groups = payload ? payload['cognito:groups'] : undefined;
	const username = payload?.username;
	const clientId = payload?.client_id as string;

	try {
		await verifyJwt(accessToken, clientId, groups);

		event.locals.accessToken = accessToken;
		event.locals.username = username;
		event.locals.usergroups = groups;
	} catch {
		event.locals.accessToken = undefined;
		event.locals.username = undefined;
		event.locals.usergroups = undefined;
	}

	return await resolve(event);
};
