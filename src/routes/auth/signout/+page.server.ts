import { redirect, type Action } from '@sveltejs/kit';
import { signOut } from '$lib/auth';
import { serialize } from 'cookie';

export const load = () => {
	throw redirect(303, '/auth/signin');
};

export const POST: Action = async ({ locals, setHeaders }) => {
	await signOut(locals.accessToken);

	locals.accessToken = undefined;
	locals.username = undefined;
	locals.usergroups = undefined;

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
