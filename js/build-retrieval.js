projects.retrieveBuildData = repos => (
	require('p-map')(repos, repo => (
		fetch(`https://simplemirror-ihhtnlywbp.now.sh/${repo.fullname ? repo.fullname : repo.full_name}`)
			.then(data => data.json())
			.then(rawCodecovData => {
				if (rawCodecovData.error) {
					return 202;
				}

				if (!rawCodecovData.commits || rawCodecovData.commits.length === 0) {
					return null;
				}

				projects.setPreview(`Fetched data successfully for ${repo.name}`);
				return rawCodecovData;
			})
			.then(codecovData => {
				if (codecovData === null) {
					return {passed: null, coverage: null};
				}

				if (codecovData === 202) {
					return {bb: true};
				}

				return {
					passed: codecovData.commits[0].ci_passed,
					coverage: codecovData.commits[0].totals.c,
				};
			})
			.then(buildData => {
				const retVal = repo;
				retVal.build = buildData;
				return retVal;
			})
			.catch(error => {
				projects.setPreview(`Ignoring ${error.message}`);
				return repo;
			})
	))
);
