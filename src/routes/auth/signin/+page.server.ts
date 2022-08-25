import type { Action } from '@sveltejs/kit';
import { signIn } from '$lib/auth';
import { serialize } from 'cookie';

export const POST: Action = async ({ request, setHeaders }) => {
	const form = await request.formData();
	const { username, password } = Object.fromEntries(form) as { [name: string]: string };

	if (!(username && password)) {
		return {
			errors: { usernameOrPasswordError: 'username or password missing.', authenticationError: '' }
		};
	}

	try {
		const authInfo = await signIn(username, password);
		const token = authInfo?.AuthenticationResult?.AccessToken;

		token &&
			setHeaders({
				'Set-Cookie': serialize('token', token, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: true,
					expires: new Date(Date.now() + 60 * 60 * 24)
				})
			});
			
		return { location: '/' };
	} catch (err) {
		console.error(err);

		return { errors: { usernameOrPasswordError: '', authenticationError: (err as Error).message } };
	}
};
