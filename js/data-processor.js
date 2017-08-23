function processApiData(apiData) {

		const elements = _(apiData).map((data) => {
				setPreview("processing " + (data.fullname || data.full_name));
				console.log(data.language);
				return $(h("div#" + data.name, data.description))
						.addClass('col-md')
						.addClass('project')
				// HACK Assume Java since all my early projects are Java, and those wouldn't have a language.
						.addClass((data.language === '' ? 'java' : data.language).toLowerCase().replace('/', ''));
		}).chunk(4).map((data) => (
				$(h('div.row')).html(data)
		)).value();

		$('body #main').addClass('container').html(elements);
}
