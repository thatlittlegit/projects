// eslint-disable-next-line no-unused-vars
function fetchCustomData(previousData) {
	return fetch('custom.json')
		.then(resp => (resp.json()))
		.then(data => (
			_.map(previousData, (repo) => {
				const newRepo = repo;
				if (data[`${repo.name}-done`]) {
					newRepo.done = true;
				}

				return data[repo.name] === undefined ? repo : (() => {
					newRepo.badges = data[repo.name];
					return newRepo;
				})();
			})
		));
}
