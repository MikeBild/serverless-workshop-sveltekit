<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	async function deleteUser(id: string) {
		const response = await fetch(`/users/${id}`, {
			method: 'DELETE'
		});
		await invalidate();
	}
</script>

<h2>Users</h2>

{#if data.message}
	<h4>{data.message}</h4>
{/if}

{#if data.users?.length}
	<table>
		<thead>
			<tr>
				<th scope="col">username</th>
				<th scope="col">enabled</th>
				<th scope="col">actions</th>
			</tr>
		</thead>
		<tbody>
			{#if data.users}
				{#each data.users as { username, enabled }}
					<tr>
						<td>{username}</td>
						<td>{enabled}</td>
						<td><button on:click={() => deleteUser(username)}>Delete</button></td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
{/if}
