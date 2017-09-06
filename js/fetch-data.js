const sources = {
	gh: 'http://api.github.com/users/thatlittlegit/repos',
	bb: 'http://api.bitbucket.org/2.0/repositories/wapidstyle?pagelen=100',
};

projects.requestError = (xhr) => {
	projects.$preview.html([
		h('strong', 'error'),
		h('br'),
		`while fetching ${xhr.responseURL} (error ${xhr.status} ${xhr.statusText})`,
		h('details#devinfo',
			h('summary',
				'developer info'),
			h('pre', $.map(xhr, (value, key) => (
				`${key}: ${String(value).split('{')[0]}\n`
			))))])
		.css('color', '#E33');
	$('#main #sneaky-preview #devinfo').css('color', '#000')
		.css('font-family', 'monospace');
	$('#main #cogs').removeClass('fa-spin').css('color', '#C33');
};

projects.fetchData = (dataType) => {
	projects.setPreview(`fetching data from ${sources[dataType]}...`);
	return fetch(sources[dataType], { pagelen: 100 })
		.then(resp => (resp.status === 200 ? resp : projects.requestError({
			responseURL: resp.url,
			status: resp.status,
			statusText: resp.statusText,
			resp,
		})))
		.then(resp => (
			resp === undefined ? (() => {
				throw new Error('Request failed!');
			})() : resp.json()
		))
		.then(response => (
			response.values instanceof Array && !(response.values instanceof Function) ?
				response.values : response
		)).then((data) => {
			projects.setPreview(`recieved ${JSON.stringify(data).length} bytes of data from ${sources[dataType]}`);

			return _(data).map(repo => (
				repo.values ? repo.values : repo
			)).map((repo) => {
				if (dataType === 'bb' && repo.mainbranch === null) {
					return null;
				}

				return repo;
			}).compact()
				.sortBy((repo) => Date.parse(repo.updated_at || repo.updated_on))
				.reverse()
				.value();
		});
};

// eslint-disable-next-line no-unused-vars
projects.processApis = () => {
	return require('p-series')([
		() => projects.fetchData('gh'),
		() => projects.fetchData('bb'),
	]).then((dataset) => {
		projects.setPreview(`data pool is currently ${JSON.stringify(dataset).length} bytes long`);
		return dataset;
	}).then(repoSet => (
		_(repoSet).flatten().uniqBy('name').map(repo => (
			repo.fork ? null : repo
		))
			.compact()
			.value()
	));
};
