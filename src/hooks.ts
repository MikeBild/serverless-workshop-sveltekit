import { getCurrentUsername, getCurrentUserGroups } from '$lib/auth';

export async function handle({ event, resolve }) {
	try {
		event.locals.username = await getCurrentUsername();
		event.locals.usergroups = await getCurrentUserGroups();
	} catch {
		event.locals.username = '';
		event.locals.usergroups = '';
	}

	return await resolve(event);
}
