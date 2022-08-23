import type { Action } from '@sveltejs/kit';
import { signIn } from '$lib/auth';
import { serialize } from 'cookie';

export const POST: Action = async ({ request, setHeaders }) => {
	const form = await request.formData();
	const { username, password } = Object.fromEntries(form) as { [name: string]: string };

	const authInfo = await signIn(username, password);
	const token = authInfo.getAccessToken().getJwtToken();

	setHeaders({
		'Set-Cookie': serialize('token', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true
		})
	});

	return {
		location: '/'
	};
};
