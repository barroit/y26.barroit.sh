/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */
divert(-1)

define(HOT, $2hover:$1 $2focus-visible:$1)
define(GROUP_HOT, HOT($1, group-))
define(GROUP_HOT_CHILD, HOT($1, *:group-))

divert(0)dnl

import { useRef } from 'preact/hooks'

import Bar from '../lib/bar.jsx'
import Flick from '../lib/flick.jsx'
import { LinkExtern, LinkIntern, ExternMark } from '../lib/link.jsx'
import Shell from '../lib/shell.jsx'

const nav_urls = [
	[ 'GitHub', 'https://github.com/barroit' ],
	[ 'Blog',   'https://crap.barroit.sh'    ],
]

const page_anchors = [
	[ 'intro',     '#intro'     ],
	[ 'log',       '#log'       ],
	[ 'gallery',   '#gallery'   ],
	[ 'highlight', '#highlight' ],
	[ 'commits',   '#commits'   ],
	[ 'credit',    '#credit'    ],
]

function fmt_link([ name, url ])
{

RETURN_JSX_BEGIN
<Shell>
  <LinkExtern href={ url } class='p-2'>
    <Flick>{ name }</Flick>
  </LinkExtern>
</Shell>
RETURN_JSX_END
}

function Banner()
{
	const links = nav_urls.map(fmt_link)

RETURN_JSX_BEGIN
<header class='px-2 md:flex justify-between text-sm font-bold'>
  <div class='hidden md:block'>
    <pre class='hidden xl:block'>
      <code>let skyColor = memory.get("last_seen_sky");</code>
    </pre>
    <pre class='xl:hidden'>
      <code>memory.get("last_seen_sky");</code>
    </pre>
  </div>
  <nav class='pr-2 flex justify-between gap-x-12 uppercase'>
    { links }
  </nav>
</header>
RETURN_JSX_END
}

function Masthead()
{

RETURN_JSX_BEGIN
<div class='select-none font-x14y20px_score_dozer uppercase'>
  <div class='mx-auto w-fit leading-none text-[13.5vw]
              text-shadow-[-.65vw_0_#ed59a9,.65vw_0_#5bb8c4]'>	    
    <span class='tracking-[4vw]'>barroi</span>
    <span>t</span>
  </div>
  <div class='mt-[1vw] font-x16y32px_grid_gazer font-bold'>  
    <div class='w-fit'>
      <Bar/>
      <p class='mt-[2vw] pl-1 text-[3vw] tracking-[.4vw]'>
        fast / scalable / no-bullshit engineering
      </p>
    </div>
    <p class='ml-auto w-fit italic text-[2.7vw] tracking-[.4vw]'>
      powered by hatsune miku
    </p>
  </div>
</div>
RETURN_JSX_END
}

function on_click_arrow(link)
{
	link.current.click()
}

function Anchor({ name, url })
{
	const link = useRef()
	const on_click_arrow_fn = on_click_arrow.bind(undefined, link)

RETURN_JSX_BEGIN
<LinkIntern ref={ link } href={ url }
      class='group flex items-center gap-x-1
             cursor-pointer motion-safe:*:transition
             GROUP_HOT_CHILD(text-miku-pink)'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'
       onclick={ on_click_arrow_fn } fill='currentColor'
       class='h-[1.1rem] rotate-90 GROUP_HOT(rotate-0)'>
    <path d='M640-480 400-720l-80 80 160 160-160 160 80 80 240-240Z'/>
  </svg>
  <p class='text-lg font-bold'>
    { name }
  </p>
</LinkIntern>
RETURN_JSX_END
}

function fmt_anchor([ name, url ])
{

RETURN_JSX_BEGIN
<Anchor name={ name } url={ url }/>
RETURN_JSX_END
}

function Menu()
{
	const anchors = page_anchors.map(fmt_anchor)

RETURN_JSX_BEGIN
<div class='relative'>
  <div class='w-full flex items-center gap-x-[1rem]'>
    <Bar class='flex-1'/>
    <p class='pl-[.5ch] text-xs tracking-[.3rem]
              font-bold text-gray-700 uppercase'>
      sections
    </p>
    <Bar class='flex-1 xl:flex-3'/>
  </div>
  <Bar class='absolute top-2 bottom-0 hidden xl:block' vertical/>
  <div class='absolute top-0 left-0 size-1 hidden xl:block bg-miku-cyan'></div>
  <nav class='p-15 space-y-15'>
    { anchors }
  </nav>
</div>
RETURN_JSX_END
}

function Body()
{

RETURN_JSX_BEGIN
<div class='grid md:grid-cols-[2fr_3fr] gap-y-10 md:gap-y-15'>
  <div class='md:col-span-2'>
    <Masthead/>
  </div>
  <div class='select-none'>
    <img src='AS_MIKU_NT_PNG' class='drop-shadow-[0_4px_4px_#0000003f]'/>
  </div>
  <div class='md:row-start-2 justify-self-center md:self-center
              mt-15 md:mt-0 w-fit'>
    <Menu/>
  </div>
</div>
RETURN_JSX_END
}

export default function Hero()
{

RETURN_JSX_BEGIN
<section class='bg-miku [--direction:to_bottom_right]'>
  <div class='pt-5'>
    <Banner/>
    <Bar class='mt-3'/>
  </div>
  <div class='mt-5 md:mt-15'>
    <Body/>
  </div>
</section>
RETURN_JSX_END
}
