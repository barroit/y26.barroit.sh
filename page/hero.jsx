/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

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
<div class='xl:w-133 2xl:w-158
            @container select-none font-x14y20px_score_dozer uppercase'>
  <div class='mx-auto w-fit leading-none text-[14.85cqw]
              text-shadow-[[[-.715cqw_0_]]MIKU_PINK,[[.715cqw_0_]]MIKU_CYAN]'>
    <span class='tracking-[4.4cqw]'>barroi</span>
    <span>t</span>
  </div>
  <div class='mt-[1.1cqw] font-x16y32px_grid_gazer font-bold'>
    <div class='w-fit'>
      <Bar/>
      <p class='mt-[2.2cqw] pl-1 text-[3.3cqw] tracking-[.44cqw]'>
        fast / scalable / no-bullshit engineering
      </p>
    </div>
    <p class='ml-auto w-fit italic text-[2.97cqw] tracking-[.44cqw]'>
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
      class='group p-2 flex items-center gap-x-1 cursor-pointer
             transition HOT(-translate-y-px) active:translate-y-0
             motion-safe:*:transition GROUP_HOT_CHILD(text-miku-pink)'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'
       onclick={ on_click_arrow_fn } fill='currentColor'
       class='h-[1.1rem] rotate-90 GROUP_HOT(rotate-0)'>
    <path d='M640-480 400-720l-80 80 160 160-160 160 80 80 240-240Z'/>
  </svg>
  <p class='text-md font-bold'>
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
  <div class='absolute top-0 left-1 w-full md:h-1
              flex items-center gap-x-[1rem]'>
    <Bar class='flex-1'/>
    <p class='pl-[.5ch] text-xs tracking-[.3rem]
              font-bold text-gray-700 uppercase'>
      sections
    </p>
    <Bar class='flex-1'/>
  </div>
  <div class='hidden md:block'>
    <Bar class='absolute top-1 bottom-0' vertical/>
    <Bar class='absolute -top-5 left-0 h-5' vertical/>
    <Bar class='absolute top-0 -left-5 w-5'/>
    <Bar class='absolute top-1 bottom-0' vertical/>
    <div class='absolute top-0 left-0 size-1 bg-miku-cyan'/>
  </div>
  <nav class='px-15 py-13 xl:py-10 2xl:py-13
              space-y-11 xl:space-y-5 2xl:space-y-11'>
    { anchors }
  </nav>
</div>
RETURN_JSX_END
}

function Body()
{

RETURN_JSX_BEGIN
<div class='grid md:grid-cols-[2fr_3fr]
            xl:grid-rows-[auto_1fr] gap-y-10 md:gap-y-15 xl:gap-y-0'>
  <div class='md:col-span-2 xl:col-span-1 xl:w-108 2xl:w-128'>
    <Masthead/>
  </div>
  <div class='xl:row-span-2'>
    <img src='AS_MIKU_NT_PNG' draggable={ false }
         class='drop-shadow-[0_4px_4px_#0000003f] select-none'/>
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
<section id='hero'>
  <div class='pt-5'>
    <Banner/>
    <Bar class='mt-3'/>
  </div>
  <div class='mt-5 md:mt-15 xl:mt-10'>
    <Body/>
  </div>
</section>
RETURN_JSX_END
}
