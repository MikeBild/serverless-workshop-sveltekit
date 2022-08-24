<script lang="ts">
	import type { Errors } from './$types';

	export let errors: Errors;
</script>

<form method="post">
	<input type="text" name="code" required />
	{#if errors}
		<p>{errors?.usernameOrCodeError || errors?.verifyCodeError}</p>
	{/if}
	<input type="submit" value="verify code" />
</form>
