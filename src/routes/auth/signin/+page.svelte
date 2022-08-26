<script lang="ts">
	import type { Errors } from './$types';

	export let errors: Errors;
	let isLoading = false;
</script>

<form
	method="post"
	on:submit={() => {
		isLoading = true;
	}}
>
	<input type="email" name="username" required />
	<input type="password" name="password" required />
	{#if errors}
		<p>{errors?.usernameOrPasswordError || errors?.authenticationError}</p>
	{/if}
	<button type="submit" disabled={isLoading} aria-busy={isLoading}>sign in</button>
	<a href="/auth/signup" role="button" class="secondary outline">sign up</a>
</form>

<style>
	form a {
		width: 100%;
	}
</style>
