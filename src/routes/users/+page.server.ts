import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { User } from '$models/User';
import { listUsers } from '$lib/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}

	try {
		const { Users: users } = await listUsers();

		return {
			users: users?.map<User>((x) => ({ username: x.Username, enabled: x.Enabled }))
		};
	} catch (err) {
		console.error(err);
		return error(400, (err as Error).message);
	}
};
