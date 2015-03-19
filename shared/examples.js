const examples = [
	{
		slug: 'clock',
		title: 'Clock',
		gist_id: '2042ca3c964200488999'
	},

	{
		slug: 'animated-chart',
		title: 'Animated chart',
		gist_id: 'cf74e6465e89ad185954'
	}
];

let slugToGistId = {};
let gistIdToSlug = {};

examples.forEach( example => {
	slugToGistId[ example.slug ] = example.gist_id;
	gistIdToSlug[ example.gist_id ] = example.slug;
});

export { examples, slugToGistId, gistIdToSlug };
