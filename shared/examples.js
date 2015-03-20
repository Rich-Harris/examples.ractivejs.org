const examples = [
	{
		slug: 'todos',
		title: 'Todos',
		gist_id: 'c96db6acc974403b7c5b'
	},

	{
		slug: 'clock',
		title: 'Clock',
		gist_id: '2042ca3c964200488999'
	},

	{
		slug: 'animated-chart',
		title: 'Animated chart',
		gist_id: 'cf74e6465e89ad185954'
	},

	{
		slug: 'comments',
		title: 'Comments',
		gist_id: '7d7a3245673e0b581caa'
	},

	{
		slug: 'ratings',
		title: 'Ratings',
		gist_id: '6ffe3f9176fb7b9a23a2'
	},

	{
		slug: 'illustration',
		title: 'Illustration',
		gist_id: '994b69187ad421703b2e'
	},

	{
		slug: 'donut-charts',
		title: 'Donut Charts',
		gist_id: 'f9dab22ad4dcec14e0be'
	}
];

let slugToGistId = {};
let gistIdToSlug = {};

examples.forEach( example => {
	slugToGistId[ example.slug ] = example.gist_id;
	gistIdToSlug[ example.gist_id ] = example.slug;
});

export { examples, slugToGistId, gistIdToSlug };
