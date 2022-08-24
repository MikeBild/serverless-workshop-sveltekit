import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }: RequestEvent) => {
	return json({});
};
