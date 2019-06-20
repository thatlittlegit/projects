projects.processApiData = apiData => {
	console.log('Data', apiData);

	function findIcon(build) {
		const $element = $(h('i.fa'));

		if (build.bb) {
			$($element).addClass('fa-bitbucket')
				.attr('title', 'BitBucket projects can\'t be fetched by Codecov (where I get the build information)');
			return $element.get();
		}

		if (build.passed === true) {
			$($element).addClass('fa-check')
				.attr('title', `Build passed with ${build.coverage}% coverage`);
			return $element.get();
		}

		$($element).addClass('fa-window-close')
			.attr('title', `Build failed with ${build.coverage}% coverage`);
		return $element.get();
	}

	function fetchIcons(repo) {
		return h('div.badges', _.map(repo.badges, badge => (
			badge.startsWith('fa:') ? h(`i.fa.fa-${badge.split(':')[1]}`) : h(`i.devicons.devicons-${badge}${badge === 'nodejs' ? '_small' : ''}`)
		)));
	}

	$('body #main').addClass('container').html(_(apiData).map(data => {
		projects.setPreview(`processing ${(data.fullname || data.full_name)}`);
		return $(h(
			`div#${data.name}`,
			h(
				'h3',
				h('a', data.name, {
					href: `${data.github ? 'https://github.com/' : 'https://bitbucket.org/'}${data.fullname || data.full_name}`,
				}),
				data.build.passed === null ? '' : findIcon(data.build),
			),
			require('emoji-shorts').toRich(data.description),
			fetchIcons(data),
		))
			.addClass('col-md')
			.addClass('project')
			.addClass(data.done ? 'done' : 'nvm')
			.addClass(data.abandoned || data.archived ? 'abandoned' : 'nvm1')
		// HACK Assume Java since all my early projects are Java, and those wouldn't have a language.
			.addClass((() => {
				if (data.github && data.language === null) {
					return '';
				}

				if (!data.github && data.language === '') {
					return 'java';
				}

				return data.language;
			})().toLowerCase().replace('/', ''));
	}).chunk(4).tap(rows => {
		while (_.last(rows).length < 4) {
			_.last(rows).push(h('div.filler-pls-ignore.col-md'));
		}
	}).map(data => (
		$(h('div.row')).html(data)
	)).value());

	$('body nav.license').css('display', 'block');
};
