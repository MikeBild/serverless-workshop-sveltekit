import type { ExternalFetch, Handle, HandleError } from '@sveltejs/kit';
import { getCurrentUsername, getCurrentUserGroups } from '$lib/auth';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		event.locals.username = await getCurrentUsername();
		event.locals.usergroups = await getCurrentUserGroups();
	} catch {
		event.locals.username = '';
		event.locals.usergroups = [];
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
