import { join } from 'path';
import { adapter } from 'sveltekit-adapter-aws';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocess(),
	kit: {
		alias: {
			$models: 'src/models'
		},
		adapter: adapter({
			autoDeploy: true,
			cdkProjectPath: join(process.cwd(), './infrastructure/deploy.js')
		})
	}
};
