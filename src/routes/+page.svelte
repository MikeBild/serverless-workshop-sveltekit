<script>
	export let data = { username: '' };
</script>

{#if data.username}
	<h2>Willkommen {data.username}!</h2>
{:else}
	<h2>Willkommen!</h2>
{/if}
