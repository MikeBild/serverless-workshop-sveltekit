import { userPool } from '$lib/auth';

export async function handle({ event, resolve }) {
	event.locals.username = userPool?.getCurrentUser()?.getUsername();

	return await resolve(event);
}
