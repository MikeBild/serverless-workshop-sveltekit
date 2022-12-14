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
	if (!locals.username) return json({ message: 'access forbidden' }, { status: 403 });

	const item = { id: randomUUID(), type: 'order', username: locals.username };

	try {
		await startExecution(item);
		await list<Order>('order');
		return json(item, { status: 201 });
	} catch (err) {
		console.error(err);
		return json({ message: 'start failed' }, { status: 400 });
	}
};
