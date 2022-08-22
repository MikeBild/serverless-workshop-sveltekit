import { getCurrentUsername, getCurrentUserGroups } from '$lib/auth';

export async function handle({ event, resolve }) {
	try {
		event.locals.username = await getCurrentUsername();
		event.locals.usergroups = await getCurrentUserGroups();
	} catch {}

	return await resolve(event);
}
