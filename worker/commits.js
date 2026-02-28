/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

const commits_url = new URL('https://api.github.com/search/commits')

commits_url.searchParams.set('q', 'author:barroit')
commits_url.searchParams.set('sort', 'author-date')
commits_url.searchParams.set('per_page', '8')

async function fetch_commits()
{
	const res = await fetch(commits_url, {
		headers: {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'barroit',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	})
	const data = await res.json()

	return [ res.ok, data ]
}

function fmt_commit({ sha, html_url, commit, repository })
{
	const author = commit.author
	const new_commit = {
		commit: sha,
		commit_url: html_url,
		repo: repository.name,
		repo_url: repository.html_url,
		message: commit.message,
		author: author.name,
		email: author.email,
		date: author.date,
	}

	return new_commit
}

export const cache_ttl_ms = 300_000
export const retry_cd_ms = 150_000
export const pathname = '/q/commits'

export async function query(req, env)
{
	const [ ok, obj ] = await fetch_commits()

	if (!ok) {
		console.error(commits_url, obj)
		return [ ST_RETRY, undefined ]
	}

	const commits = {}

	commits.total = obj.total_count
	commits.recent = obj.items.map(fmt_commit)

	return [ ST_DONE, commits ]
}
