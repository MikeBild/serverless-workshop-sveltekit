import type { Action } from '@sveltejs/kit';
import { signOut } from '$lib/auth';

export const POST: Action = async ({ locals }) => {
	await signOut();

	locals.username = '';
	locals.usergroups = [];

	return {
		location: '/'
	};
};
