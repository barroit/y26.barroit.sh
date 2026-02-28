/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useState } from 'preact/hooks'

import Bar from '../lib/bar.jsx'
import Dead from '../lib/dead.jsx'
import useMobile from '../lib/device.js'
import Flick from '../lib/flick.jsx'
import { LinkExtern } from '../lib/link.jsx'
import { time_to_mailish } from '../lib/time.js'

function Hash({ commit, commit_url, repo, repo_url })
{
	const mobile = useMobile()

RETURN_JSX_BEGIN
<pre class='flex'>
  <p class='text-yellow-600'>commit </p>
  <LinkExtern href={ commit_url } class='text-indigo-700'>
    <div class='flex after:content-["..."] lg:after:content-[""]
                *:block *:w-[16ch] lg:*:w-auto *:overflow-hidden'>
    { !mobile ? (
      <Flick>{ commit }</Flick>
    ) : (
      <span>{ commit }</span>
    ) }
    </div>
  </LinkExtern>
  <span>
    <span> (</span>
    <LinkExtern href={ repo_url } class='text-indigo-700'>
    { !mobile ? (
      <Flick>{ repo }</Flick>
    ) : (
      <span>{ repo }</span>
    ) }
    </LinkExtern>
    <span>)</span>
  </span>
</pre>
RETURN_JSX_END
}

function fmt_body(line)
{

RETURN_JSX_BEGIN
<pre>
  <pre class='inline-block pl-[4ch]'>{ line }</pre>
</pre>
RETURN_JSX_END
}

function Commit({ commit, commit_url, repo, repo_url,
		  message, author, email, date })
{
	const mobile = useMobile()

	const __time = new Date(date)
	const time = time_to_mailish(__time)

	const lines = message.split('\n')
	const body = lines.map(fmt_body)

RETURN_JSX_BEGIN
<div class='text-sm w-fit
            *:before:mr-[1ch] last:*:not-first:before:mr-[2ch]
            *:first:before:content-["*"]
            not-last:*:not-first:before:content-["|"]
            not-last:*:not-first:before:text-red-600
            not-last:*:not-first:before:font-bold
            last:*:last:hidden'>
  <Hash { ...{ commit, commit_url, repo, repo_url } }/>
  <pre>Author: { author } { `<${ email }>` }</pre>
  <pre>Date:   { time }</pre>
  <pre></pre>
  { body }
  <pre></pre>
</div>
RETURN_JSX_END
}

function fmt_commit(props)
{

RETURN_JSX_BEGIN
<Commit { ...props }/>
RETURN_JSX_END
}

function Terminal({ total, recent })
{
	total = total.toLocaleString('en-US')
	recent = recent.map(fmt_commit)

RETURN_JSX_BEGIN
<div class='py-5 px-4 lg:px-0 lg:flex flex-row'>
  <div class='lg:mx-2 lg:flex lg:*:text-vertical'>
    <p class='text-xl uppercase'>Recent Commit by Barroit</p>
    <p class='mt-1 lg:ml-1 text-right text-sm text-zinc-800'>
      { total } in total
    </p>
  </div>
  <Bar class='lg:hidden mt-2 mb-4'/>
  <Bar class='hidden lg:block' vertical/>
  <div class='lg:px-4 max-h-[80svh] w-full overflow-auto'>
    { recent }
  </div>
</div>
RETURN_JSX_END
}

function FakeTerminal()
{
}

export default function Commits()
{
	const [ commits, set_commits ] = useState({})

	useEffect(async () =>
	{
		// const res = await fetch('/q/commits')
		// let data

		// if (res.ok)
		// 	data = await res.json()

		set_commits(data)
	}, [])

RETURN_JSX_BEGIN
<section id='commits'
         class='[--pastel-left:var(--pastel-green)]
                [--pastel-mid:var(--pastel-lavender)]
                [--pastel-right:var(--pastel-cyan)]'>
{ !commits ? (
  <Dead>Commits is broken</Dead>
) : (
  <div class='mx-auto px-5 max-w-md lg:max-w-5xl'>
    <div class='rounded-md shadow-sm bg-zinc-200/39'>
    { commits.total ? (
      <Terminal { ...commits }/>
    ) : (
      <FakeTerminal/>
    ) }
    </div>
  </div>
) }
</section>
RETURN_JSX_END
}

const data = {
    "total": 4339,
    "recent": [
        {
            "commit": "a2a706861da7f1c15e573741a21b04fd1f2da354",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/a2a706861da7f1c15e573741a21b04fd1f2da354",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page/highlight: apply blur border on button\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T10:20:32.000+09:00"
        },
        {
            "commit": "8c543b66cdd948107d2fa7691faf09a234ec6c2c",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/8c543b66cdd948107d2fa7691faf09a234ec6c2c",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page/gallery: add border radius on photo\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T09:58:32.000+09:00"
        },
        {
            "commit": "9f92e12c6f97b6dbfd810417f8e0583305696a80",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/9f92e12c6f97b6dbfd810417f8e0583305696a80",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page/gallery: enable pressing animation for photo dialog button\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T09:53:50.000+09:00"
        },
        {
            "commit": "56c0fe8ee4badfd3e7b579b4cd23237877c05d33",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/56c0fe8ee4badfd3e7b579b4cd23237877c05d33",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page: add highlight section\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T09:41:53.000+09:00"
        },
        {
            "commit": "e3253976902fdef8353afe8a85e62c7e6b59630f",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/e3253976902fdef8353afe8a85e62c7e6b59630f",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page: disable selection on decorative elements\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T06:13:55.000+09:00"
        },
        {
            "commit": "8f4b86f73b8e6ea20a779ebd5d98ba278def3f78",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/8f4b86f73b8e6ea20a779ebd5d98ba278def3f78",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page: enable button animation for mobile devices\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T05:45:39.000+09:00"
        },
        {
            "commit": "ac0b17ca0d94ba37963471ce6122e942badca508",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/ac0b17ca0d94ba37963471ce6122e942badca508",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "page/intro: drop Temporal\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T04:34:54.000+09:00"
        },
        {
            "commit": "249462764c09fb54909a57326a026ce5118d0597",
            "commit_url": "https://github.com/barroit/y26.barroit.sh/commit/249462764c09fb54909a57326a026ce5118d0597",
            "repo": "y26.barroit.sh",
            "repo_url": "https://github.com/barroit/y26.barroit.sh",
            "message": "build: don't hard link on intermediate files\n\nSigned-off-by: Jiamu Sun <barroit@linux.com>",
            "author": "Jiamu Sun",
            "email": "barroit@linux.com",
            "date": "2026-02-27T02:51:50.000+09:00"
        }
    ]
}
