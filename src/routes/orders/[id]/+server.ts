import { remove } from '$lib/database';
import { stopExecution, sendTaskSuccess } from '$lib/stepfunction';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }: RequestEvent) => {
	const item = { confirm: true };
	const body = await request.json();
	try {
		await sendTaskSuccess(body.taskToken, item);
		await remove('order', params.id);
		return json(item, { status: 200 });
	} catch (err) {
		console.error(err);
		return json({ message: 'order update failed' }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ params, request }: RequestEvent) => {
	const body = await request.json();
	try {
		await stopExecution(body.executionArn);
		await remove('order', params.id);
		return json(undefined, { status: 204 });
	} catch (err) {
		console.error(err);
		return json({ message: 'stop failed' }, { status: 400 });
	}
};
