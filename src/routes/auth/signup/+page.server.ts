import type { Action } from '@sveltejs/kit';
import { signUp } from '$lib/auth';

export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	const { username, password } = Object.fromEntries(form) as { [name: string]: string };

	if (!(username && password)) {
		return {
			errors: { usernameOrPasswordError: 'username or password missing', signUpError: '' }
		};
	}

	try {
		await signUp(username, password);
		return { location: `/auth/verify?username=${username}` };
	} catch (err) {
		console.error(err);

		return { errors: { usernameOrPasswordError: '', signUpError: (err as Error).message } };
	}
};
