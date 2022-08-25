import type { PageServerLoad } from './$types';
import type { Order } from '$models/Order';
import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { list } from '$lib/database';
import { randomUUID } from 'crypto';
import { startExecution } from '$lib/stepfunction';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.usergroups?.includes('admins')) {
		return error(403, 'access forbidden.');
	}

	return { orders: await list<Order>('order') };
};

export const POST: RequestHandler = async ({ locals }: RequestEvent) => {
	const item = { id: randomUUID(), type: 'order', username: locals.username };

	try {
		await startExecution(item);
		await list<Order>('order');
	} catch (err) {
		return json({ message: 'start failed' }, { status: 400 });
	}

	return json(item, { status: 201 });
};
