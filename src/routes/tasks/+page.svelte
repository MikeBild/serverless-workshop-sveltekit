<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Tasks</h2>

{#if data.message}
	<h4>{data.message}</h4>
{/if}

{#if data.tasks?.length}
	<table>
		<thead>
			<tr>
				<th scope="col">id</th>
				<th scope="col">updated at</th>
				<th scope="col">actions</th>
			</tr>
		</thead>
		<tbody>
			{#if data.tasks}
				{#each data.tasks as { id, taskToken, updatedAt }}
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
