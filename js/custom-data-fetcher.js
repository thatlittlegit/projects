// eslint-disable-next-line no-unused-vars
function fetchCustomData(previousData) {
	return fetch('custom.json')
		.then(resp => (resp.json()))
		.then(data => (_.merge(previousData, data)));
}
