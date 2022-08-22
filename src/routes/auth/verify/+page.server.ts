import { verifyUser } from '$lib/auth';

export async function POST({ request, url }) {
	const form = await request.formData();
	const { code } = Object.fromEntries(form);
	const username = url.searchParams.get('username');

	await verifyUser(username, code);

	return {
		location: '/auth/signin'
	};
}
