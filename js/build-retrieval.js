// eslint-disable-next-line no-unused-vars
projects.retrieveBuildData = (repos) => {
	return require('p-map')(repos, repo => (
		fetch(`https://simplemirror-ihhtnlywbp.now.sh/${repo.fullname ? repo.fullname : repo.full_name}`)
			.then(data => (
				data.json()
			))
			.then((rawCodecovData) => {
				if (rawCodecovData.error) {
					return 202;
				} else if (!rawCodecovData.commits || rawCodecovData.commits.length === 0) {
					return null;
				}

				projects.setPreview(`Fetched data successfully for ${repo.name}`);
				return rawCodecovData;
			})
			.then((codecovData) => {
				if (codecovData === null) {
					return { passed: null, coverage: null };
				}	else if (codecovData === 202) {
					return { bb: true };
				}
				return {
					passed: codecovData.commits[0].ci_passed,
					coverage: codecovData.commits[0].totals.c,
				};
			})
			.then((buildData) => {
				const retVal = repo;
				retVal.build = buildData;
				return retVal;
			})
			.catch((err) => {
				projects.setPreview(`Ignoring ${err.message}`);
				return repo;
			})
	));
};
