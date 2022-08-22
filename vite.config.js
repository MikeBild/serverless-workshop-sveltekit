import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
export default {
	plugins: [
		sveltekit(),

		// <workaround for https://github.com/sveltejs/kit/issues/5843>
		{
			config(config) {
				if (config.build.rollupOptions.output) {
					const original = config.build.rollupOptions.output.assetFileNames;
					config.build.rollupOptions.output.assetFileNames = (assetInfo) => {
						const match = assetInfo.name.match(/\/\+(.*)\.css$/);
						return match ? original.replace('[name]', match[1]) : original;
					};
				}
				return config;
			}
		}
		// </workaround>
	]
};
