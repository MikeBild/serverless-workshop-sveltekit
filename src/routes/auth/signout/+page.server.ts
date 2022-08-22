import { signOut } from '$lib/auth';

export async function POST({ locals }: any) {
	await signOut(locals.username);
	locals.username = '';
	return {
		location: '/'
	};
}
