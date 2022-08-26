<script lang="ts">
	import 'remixicon/fonts/remixicon.css';
	import '@picocss/pico/css/pico.css';
	import '../global.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<svelte:head>
	<title>Serverless Workshop</title>
</svelte:head>

<Header username={data.username} />

<main class="container">
	<slot />
</main>

<Footer />
