// eslint-disable-next-line no-unused-vars
function processApiData(apiData) {
	// eslint-disable-next-line no-console
	console.log('Data', apiData);

	function findIcon(build) {
		const $element = $(h('i.fa'));

		if (build.bb) {
			$($element).addClass('fa-bitbucket')
				.attr('title', 'BitBucket projects can\'t be fetched by Codecov (where I get the build information)');
			return $element.get();
		} else if (build.passed === true) {
			$($element).addClass('fa-check')
				.attr('title', `Build passed with ${build.coverage}% coverage`);
			return $element.get();
		}

		$($element).addClass('fa-window-close')
			.attr('title', `Build failed with ${build.coverage}% coverage`);
		return $element.get();
	}

	$('body #main').addClass('container').html(_(apiData).map((data) => {
		setPreview(`processing ${(data.fullname || data.full_name)}`);
		return $(h(`div#${data.name}`,
			h('h3',
				h('a', data.name),
				data.build.passed === null ? '' : findIcon(data.build)),
			data.description))
			.addClass('col-md')
			.addClass('project')
		// HACK Assume Java since all my early projects are Java, and those wouldn't have a language.
			.addClass((data.language === '' ? 'java' : data.language).toLowerCase().replace('/', ''));
	}).chunk(4).map(data => (
		$(h('div.row')).html(data)
		// eslint-disable-next-line newline-per-chained-call
	)).value());
}