import { deleteUser } from '$lib/auth';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		await deleteUser(params.id);
		return json(undefined, { status: 204 });
	} catch (e) {
		return json(undefined, { status: 404 });
	}
};
