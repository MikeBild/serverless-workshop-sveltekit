<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.username}
	<h2>Welcome {data.username}!</h2>
{:else}
	<h2>Welcome!</h2>
{/if}
