import { getCurrentUserGroups } from '$lib/auth';

export async function load() {
	const data = await getCurrentUserGroups();

	return data;
}
