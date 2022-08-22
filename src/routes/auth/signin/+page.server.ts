import { signIn } from '$lib/auth';

export async function POST({ request }: any) {
	const form = await request.formData();
	const { username, password } = Object.fromEntries(form);

	await signIn(username, password);

	return {
		location: '/'
	};
}
