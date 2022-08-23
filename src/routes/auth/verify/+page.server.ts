import { verifyUser } from '$lib/auth';
import type { Action } from '@sveltejs/kit';

export const POST: Action = async ({ request, url }) => {
	const form = await request.formData();
	const { code } = Object.fromEntries(form) as { [name: string]: string };
	const username = url.searchParams.get('username');

	await verifyUser(username!, code);

	return {
		location: '/auth/signin'
	};
};
