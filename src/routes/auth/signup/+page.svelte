<script lang="ts">
	import type { Errors } from './$types';

	export let errors: Errors;
</script>

<form method="post">
	<input type="email" name="username" required />
	<input type="password" name="password" required />
	{#if errors}
		<p>{errors?.usernameOrPasswordError || errors?.signUpError}</p>
	{/if}
	<input type="submit" value="sign up" />
</form>
