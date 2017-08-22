const sources = {
		gh: "http://api.github.com/users/thatlittlegit/repos",
		bb: "http://api.bitbucket.org/2.0/repositories/wapidstyle?pagelen=100"
};

function requestError(xhr) {
		$preview.html([
				h('strong', 'error'),
				h('br'),
				'while fetching ' + xhr.responseURL + ' (error ' + xhr.status + ' ' + xhr.statusText + ')',
				h('details#devinfo',
					h('summary',
						'developer info'),
					h('pre', $.map(xhr, (value, key) => (
							key + ': ' + String(value).split('{')[0] + '\n'
					)))
				 )
		])
				.css('color', '#E33');
		$('#main #sneaky-preview #devinfo').css('color', '#000')
				.css('font-family', 'monospace');
		$('#main #cogs').removeClass('fa-spin').css('color', '#C33');
}

function fetchData(dataType) {

		setPreview('fetching data from ' + sources[dataType] + '...');

		return $.getJSON(sources[dataType], { pagelen: 100 }).then((response) => (
				response.values instanceof Array && ! response.values instanceof Function ? response.values : response
		)).then((data) => {
				setPreview('recieved ' + JSON.stringify(data).length + ' bytes of data from ' + sources[dataType]);
				
				return _(dataType === 'bb' ? data.values : data).map((repo) => {
						return repo.values ? repo.values : repo;
				}).map((repo) => {
						if(dataType === 'bb' && repo.mainbranch === null) {
								return null;
						} else if (repo.values) {
								return repo.values;
						} else {
								return repo;
						}
				}).compact().sort().value();
		});
}

function processApis() {
		$.ajaxSettings.error = requestError;
		return pSeries([
				() => fetchData('gh'),
				() => fetchData('bb')
		]).then((dataset) => {
				setPreview('data pool is currently ' + JSON.stringify(dataset).length + ' bytes long');
				return dataset;
		}).then((repoSet) => (
				_(repoSet).flatten().uniqBy('name').map((repo) => (
						repo.fork ? null : repo
				)).compact().value()
		));
}
