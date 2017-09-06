// eslint-disable-next-line no-unused-vars
projects.fetchCustomData = (previousData) => {
	return fetch('custom.json')
		.then(resp => (resp.status === 200 ? resp : (() => {
			projects.setPreview(`Ignoring error while fetching ${resp.url} (error ${resp.status}: ${resp.statusText})`);
			throw new Error();
		})()))
		.then(resp => (resp.json()))
		.then(data => (
			_.map(previousData, (repo) => {
				const newRepo = repo;
				if (data[`${repo.name}-done`]) {
					newRepo.done = true;
				} else if (data[`${repo.name}-abandoned`]) {
					newRepo.abandoned = true;
				}

				return data[repo.name] === undefined ? repo : (() => {
					newRepo.badges = data[repo.name];
					return newRepo;
				})();
			})
		))
		.catch(() => {}); // ignore
};
