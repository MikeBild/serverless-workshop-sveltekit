import { signOut } from '$lib/auth';

export async function POST({ locals }) {
	await signOut();
	
	locals.username = '';
	locals.usergroups = '';
	
	return {
		location: '/'
	};
}
