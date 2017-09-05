// eslint-disable-next-line no-unused-vars
function fetchCustomData(previousData) {
	return fetch('custom.json')
		.then(resp => (resp.json()))
		.then(data => (
			_.map(previousData, repo => (
				data[repo.name] === undefined ? repo : (() => {
					const newRepo = repo;
					newRepo.badges = data;
					return newRepo;
				})()
			))
		));
}
