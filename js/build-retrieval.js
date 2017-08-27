// eslint-disable-next-line no-unused-vars
function retrieveBuildData(repos) {
	$.ajaxSettings.error = () => {};

	return pSeries(_.map(repos, repo => (
		$.getJSON(`https://simplemirror-ihhtnlywbp.now.sh/${repo.fullname ? repo.fullname : repo.full_name}`)
			.then((rawCodecovData) => {
				if (rawCodecovData.commits.length === 0) {
					return true;
				}

				return rawCodecovData;
			})
			.then(codecovData => (
				codecovData === true ? { passed: null, coverage: null } : {
					passed: codecovData.commits[0].ci_passed,
					coverage: codecovData.commits[0].totals.c,
				}
			))
			.then((buildData) => {
				const retVal = repo;
				retVal.build = buildData;
				return retVal;
			})
	)));
}
