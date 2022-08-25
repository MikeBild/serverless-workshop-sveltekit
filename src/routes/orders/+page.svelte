<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	async function startOrder() {
		await fetch(`/orders/${data.username}`, {
			method: 'PUT'
		});
		await invalidate();
	}
</script>

<h2>orders</h2>

{#if data.message}
	<h4>{data.message}</h4>
{/if}

{#if !data.message}
	<div><button on:click={startOrder}>Start</button></div>
	{#if data.orders?.length}
		<table>
			<thead>
				<tr>
					<th scope="col">id</th>
					<th scope="col">updated at</th>
					<th scope="col">actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.orders}
					{#each data.orders as { id, taskToken, updatedAt }}
						<tr>
							<td>{id}</td>
							<td>{updatedAt}</td>
							<td><button>Confirm</button><button>Stop</button></td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{/if}
{/if}
