function processApiData(apiData) {

		const elements = _(apiData).map((data) => {
				setPreview("processing " + (data.fullname || data.full_name));
				return $(h("div#" + data.name, data.description)).addClass('col-md').addClass('project');
		}).chunk(4).map((data) => {
				return $(h('div.row')).html(data);
		}).value();

		$('body #main').addClass('container').html(elements);
}
