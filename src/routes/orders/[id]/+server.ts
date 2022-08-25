import { startExecution } from '$lib/stepfunction';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { randomUUID } from 'crypto';

export const PUT: RequestHandler = async ({ locals }: RequestEvent) => {
	const item = { id: randomUUID(), type: 'order', username: locals.username };

	await startExecution(item);

	return json(item, { status: 200 });
};
