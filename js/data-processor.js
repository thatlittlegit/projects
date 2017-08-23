// eslint-disable-next-line no-unused-vars
function processApiData(apiData) {
	$('body #main').addClass('container').html(_(apiData).map((data) => {
		setPreview(`processing ${(data.fullname || data.full_name)}`);
		return $(h(`div#${data.name}`, h('h3', data.name), data.description))
			.addClass('col-md')
			.addClass('project')
		// HACK Assume Java since all my early projects are Java, and those wouldn't have a language.
			.addClass((data.language === '' ? 'java' : data.language).toLowerCase().replace('/', ''));
	}).chunk(4).map(data => (
		$(h('div.row')).html(data)
		// eslint-disable-next-line newline-per-chained-call
	)).value());
}
