import { redirect, type Action } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { signOut } from '$lib/auth';
import { serialize } from 'cookie';

export const load: PageServerLoad = () => {
	throw redirect(303, '/auth/signin');
};

export const POST: Action = async ({ locals, setHeaders }) => {
	if (!locals.accessToken) {
		throw redirect(303, '/auth/signin');
	}

	await signOut(locals.accessToken);

	setHeaders({
		'Set-Cookie': serialize('token', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			expires: new Date(Date.now() - 3600)
		})
	});

	return {
		location: '/'
	};
};
