import type { PageServerLoad } from './$types';
import type { Order } from '$models/Order';
import { error } from '@sveltejs/kit';
import { list } from '$lib/database';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}

	return { orders: await list<Order>('order') };
};
