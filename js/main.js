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
} catch (e) {
	window.failedLoad = true;
	// eslint-disable-next-line prefer-template
	$('#main').html('<h1>error!</h1>Some features are not supported n your browser. Please upgrade your browser.<pre>' + e.stack + '</pre>');
}

let $preview;

function setPreview(text) {
	$($preview).html(text || '?');
}
$(document).ready(() => {
	if (window.failedLoad) {
		return;
	}

	window.h = hyperscript;
	window.pSeries = require('p-series');

	$('#main').html(
		[
			h('i.fa.fa-cog.fa-spin.fa-4x#cogs'),
			h('p#sneaky-preview',
				'getting started'),
		]);

	$preview = $('#main p#sneaky-preview');
	setPreview('getting started...');

	processApis().then(retrieveBuildData).then(processApiData);
});
