<script>
	export let data;
</script>

<h2>Users</h2>
{#if data.message}
	<h3>{data.message}</h3>
{/if}
<ul>
	{#if data.users}
		{#each data.users as { username, enabled }}
			<li>{username} - {enabled}</li>
		{/each}
	{/if}
</ul>
