<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string = 'Confirm your action!';
	export let isOpen: boolean = false;

	function close() {
		dispatch('close', {});
		isOpen = !isOpen;
	}
	function ok() {
		dispatch('ok', {});
		isOpen = !isOpen;
	}
</script>

<dialog id="modal-example" open={isOpen}>
	<article>
		<a href="#close" aria-label="Close" class="close" data-target="modal-example" on:click={close}
			>&nbsp;</a
		>
		<h3>{title}</h3>
		<p>
			<slot />
		</p>
		<footer>
			<a href="#ok" role="button" data-target="modal-example" on:click={ok}> OK </a>
		</footer>
	</article>
</dialog>
