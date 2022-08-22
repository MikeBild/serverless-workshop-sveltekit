<script>
	export let data = { username: '' };
</script>

{#if data.username}
	<h2>Welcome {data.username}!</h2>
{:else}
	<h2>Welcome!</h2>
{/if}
