import { remove } from '$lib/database';
import { stopExecution, sendTaskSuccess } from '$lib/stepfunction';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }: RequestEvent) => {
	if (!locals.username) return json({ message: 'access forbidden' }, { status: 403 });

	const item = { confirm: true };
	const body = await request.json();
	try {
		await sendTaskSuccess(body.taskToken, item);
		await remove('order', params.id);
		return json(item, { status: 200 });
	} catch (err) {
		console.error(err);
		return json({ message: 'update order failed' }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ params, request, locals }: RequestEvent) => {
	if (!locals.username) return json({ message: 'access forbidden' }, { status: 403 });

	const body = await request.json();
	try {
		await stopExecution(body.executionArn);
		await remove('order', params.id);
		return json(undefined, { status: 204 });
	} catch (err) {
		console.error(err);
		return json({ message: 'stop order failed' }, { status: 400 });
	}
};
