try {
	// Check if arrow functions work
	// eslint-disable-next-line no-eval
	eval(`() => {}
let i = false
const t = 0
i = 2
try {
  eval('t = 3')
} catch (e) { i = true }

if (!i) throw new Error();
`);
} catch (error) {
	window.failedLoad = true;
	$('#main').html(`<h1>error!</h1>
<p>Some features are not supported n your browser. Please upgrade your browser.</p>
<pre>
${error.stack}
</pre>`);
}

projects.setPreview = text => {
	$(projects.$preview).html(text || '?');
};

$(document).ready(() => {
	if (window.failedLoad) {
		return;
	}

	window.h = hyperscript;

	$('#main').html([
		h('i.fa.fa-cog.fa-spin.fa-4x#cogs'),
		h(
			'p#sneaky-preview',
			'getting started',
		),
	]);

	projects.$preview = $('#main p#sneaky-preview');
	projects.setPreview('getting started...');

	projects.processApis()
		.then(projects.retrieveBuildData)
		.then(projects.fetchCustomData)
		.then(projects.processApiData);
});
