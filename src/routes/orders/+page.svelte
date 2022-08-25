<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	import ModalOk from '$lib/components/ModalOk.svelte';

	export let data: PageData;

	let isOpen = false;

	async function refetch() {
		await invalidate();
	}

	async function startOrder() {
		isOpen = true;
		await fetch(`/orders`, { method: 'POST' });
	}

	async function stopOrder(id: string, executionArn: string) {
		await fetch(`/orders/${id}`, {
			method: 'DELETE',
			body: JSON.stringify({ executionArn })
		});
		await invalidate();
	}

	async function confirmOrder(id: string, taskToken: string) {
		await fetch(`/orders/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ taskToken })
		});
		await invalidate();
	}
</script>

<ModalOk bind:isOpen on:ok={refetch} on:close={refetch} title="order executed">
	<h4>thank you</h4>
</ModalOk>

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
					{#each data.orders as { id, taskToken, updatedAt, executionArn }}
						<tr>
							<td>{id}</td>
							<td>{updatedAt}</td>
							<td
								><button on:click={() => confirmOrder(id, taskToken)}>Confirm</button><button
									on:click={() => stopOrder(id, executionArn)}>Stop</button
								></td
							>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{/if}
{/if}
