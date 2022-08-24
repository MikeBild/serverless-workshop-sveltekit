<script lang="ts">
	import type { Errors } from './$types';

	export let errors: Errors;
</script>

<form method="post">
	<input type="email" name="username" required />
	<input type="password" name="password" required />
	{#if errors}
		<p>{errors?.usernameOrPasswordError}</p>
	{/if}
	<input type="submit" value="sign in" />
	<a href="/auth/signup" role="button" class="secondary outline">sign up</a>
</form>

<style>
	form a {
		width: 100%;
	}
</style>
