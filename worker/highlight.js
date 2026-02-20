/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

const repo_query = `
query {
  node(id: "U_kgDOA_eCTA") {
    ... on User {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            homepageUrl
            primaryLanguage { color name }
            pushedAt
            repositoryTopics(first: 3) {
              nodes {
                topic { name }
              }
            }
          }
        }
      }
    }
  }
}
`

async function fetch_repos(pat)
{
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${pat}`,
			'Content-Type': 'application/json',
			'User-Agent': 'barroit',
		},
		body: JSON.stringify({ query: repo_query }),
	})
	const data = await res.json()

	return [ res.ok, data ]
}

async function fetch_stats(pat, repo)
{
	const url = 'https://api.github.com/repos' +
		    `/barroit/${repo.name}/stats/contributors`
	const res = await fetch(url, {
		headers: {
			'Accept': 'application/vnd.github+json',
			'Authorization': `Bearer ${pat}`,
			'User-Agent': 'barroit',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	})
	const data = await res.json()

	return [ res.ok, data, repo.name ]
}

function trans_stats([ ok, data, name ])
{
	if (!ok) {
		console.error(name, data)
		return
	}

	if (!Array.isArray(data))
		return data

	const calc_lines = (prev, next) => prev + next.a - next.d
	const calc_history = (prev, next) => ({
		commits: prev.commits + next.total,
		lines: prev.lines + next.weeks.reduce(calc_lines, 0),
	})

	return data.reduce(calc_history, { commits: 0, lines: 0 })
}

export const cache_ttl_ms = 300_000
export const retry_cd_ms = 150_000
export const pathname = '/q/highlight'

export async function query(req, env, prev = [])
{
	const pat = env.GITHUB_PAT
	let repos = prev
	const cached = !!prev.length

	if (!cached) {
		const [ ok, obj ] = await fetch_repos(pat)

		if (!ok) {
			console.error(repo_query, obj)
			return [ ST_RETRY, undefined ]
		}

		repos = obj.data.node.pinnedItems.nodes

	}

	const tasks = []

	for (const repo of repos) {
		const found = prev.find(({ name }) => repo.name == name)
		let task

		if (found && found.history && found.history.commits)
			task = [ true, found.history, found.name ]
		else
			task = fetch_stats(pat, repo)

		tasks.push(task)
	}

	const stats_dirty = await Promise.all(tasks)
	const stats = stats_dirty.map(trans_stats)

	const trans_topic = ({ topic }) => topic.name
	let highlights

	if (!cached) {
		highlights = repos.map((repo, idx) => ({
			name: repo.name,
			lang: repo.primaryLanguage,
			desc: repo.description,
			topic: repo.repositoryTopics.nodes.map(trans_topic),
			docs: repo.homepageUrl,
			pushed: repo.pushedAt,
			history: stats[idx],
		}))

	} else {
		highlights = repos.map((repo, idx) => ({
			...repo,
			history: stats[idx],
		}))
	}

	let state = ST_DONE
	const retry = stats.filter(stat => !stat || !stat.commits)

	if (retry.length)
		state = ST_RETRY

	return [ state, highlights ]
}
