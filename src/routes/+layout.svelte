<script>
	import '../global.css';
	import '@picocss/pico/css/pico.css';
	import 'remixicon/fonts/remixicon.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data = { username: '' };
</script>

<svelte:head>
	<title>Serverless Workshop</title>
</svelte:head>

<Header username={data.username} />
<main class="container">
	
		<slot />
	
</main>

<Footer />
