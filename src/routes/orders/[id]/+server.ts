import { stopExecution } from '$lib/stepfunction';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		await stopExecution(params.id);
	} catch (err) {
		console.error(err);
	}

	return json(undefined, { status: 204 });
};
