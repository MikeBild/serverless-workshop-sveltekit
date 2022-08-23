<script>
	export let username = '';
</script>

<nav class="container-fluid sticky">
	<ul>
		<li>
			<a href="/" class="contrast"><strong>Serverless Workshop</strong></a>
		</li>
	</ul>
	<ul>
		<li>
			<a href="/profile" class="secondary"><strong>{username || ''}</strong></a>
		</li>

		<li>
			<details role="list" dir="rtl">
				<summary aria-haspopup="listbox" role="link" class="contrast"
					><i class="ri-menu-4-fill" /></summary
				>
				<ul role="listbox">
					<li><a href="/shop">shop</a></li>
					<li><a href="/contact">contact</a></li>
					{#if username}
					<li><a href="/users">users</a></li>
					{/if}
					<li>
						{#if username}
							<form method="post" action="/auth/signout">
								<input type="submit" value="sign out" />
							</form>
						{/if}

						{#if !username}
							<a href="/auth/signin">sign in</a>
						{/if}
					</li>
				</ul>
			</details>
		</li>
	</ul>
</nav>

<style>
	.sticky {
		position: sticky;
		top: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.573);
		position: sticky;
		position: -webkit-sticky;
	}
	form {
		margin-bottom: 0;
	}
</style>
