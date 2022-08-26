<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	import ModalOk from '$lib/components/ModalOk.svelte';

	export let data: PageData;

	let isOpen = false;
	let isLoading = false;

	async function refetch() {
		isLoading = true;
		await invalidate();
		isLoading = false;
	}

	async function startOrder() {
		isLoading = true;
		await fetch(`/orders`, { method: 'POST' });
		await refetch();
	}

	async function cancelOrder(id: string, executionArn: string) {
		isLoading = true;
		await fetch(`/orders/${id}`, {
			method: 'DELETE',
			body: JSON.stringify({ executionArn })
		});
		await refetch();
	}

	async function completeOrder(id: string, taskToken: string) {
		isLoading = true;
		await fetch(`/orders/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ taskToken })
		});
		await refetch();
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
	<div>
		<button on:click={startOrder} aria-busy={isLoading} disabled={isLoading}>Start</button>
	</div>
	{#if data.orders?.length}
		<table role="grid">
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
							<td>
								<button disabled={isLoading}>confirm availability (WIP)</button>
								<button disabled={isLoading}>confirm payment (WIP)</button>
								<button disabled={isLoading}>confirm shipment (WIP)</button>
								<button disabled={isLoading} on:click={() => completeOrder(id, taskToken)}
									>complete order</button
								>
								<button disabled={isLoading} on:click={() => cancelOrder(id, executionArn)}
									>cancel order</button
								>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	{/if}
{/if}
