module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: 'xo',
	overrides: [
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: {
				'@typescript-eslint/naming-convention': [
					'error',
					{selector: 'parameterProperty', format: null},
				],
			},
		},
	],
	ignorePatterns: [
		'/lib/**/*', // Ignore built files.
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['tsconfig.json', 'tsconfig.dev.json'],
	},
	rules: {
	},
};
