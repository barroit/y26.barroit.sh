/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Flick from './flick.jsx'
import { LinkExtern } from './link.jsx'
import Shell from './shell.jsx'

const nav_urls = [
	[ 'GitHub', 'https://github.com/barroit' ],
	[ 'Crap',   'https://crap.barroit.sh'    ],
]

function fmt_link([ name, url ])
{

RETURN_JSX_BEGIN
<Shell>
  <LinkExtern href={ url }>
    <Flick>{ name }</Flick>
  </LinkExtern>
</Shell>
RETURN_JSX_END
}

function Nav()
{
	const links = nav_urls.map(fmt_link)

RETURN_JSX_BEGIN
<div class='flex justify-between gap-x-12 uppercase px-3'>
  { links }
</div>
RETURN_JSX_END
}

function Banner()
{

RETURN_JSX_BEGIN
<div class='mt-5'>
  <div class='px-5 md:px-2 md:flex justify-between text-h4 font-bold'>
    <div class='hidden xl:block'>
      let skyColor = memory.get("last_seen_sky");
    </div>
    <div class='hidden md:block xl:hidden'>
      memory.get("last_seen_sky");
    </div>
    <Nav/>
  </div>
  <div class='mt-3 h-2 bg-miku-cyan'></div>
</div>
RETURN_JSX_END
}

export default function Intro()
{

RETURN_JSX_BEGIN
<div class='h-screen [--angle:135deg] bg-miku drop-shadow-xl'>
  <Banner/>
</div>
RETURN_JSX_END
}
