/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useRef } from 'preact/hooks'

import Flick from '../lib/flick.jsx'
import { LinkExtern, LinkIntern, ExternMark } from '../lib/link.jsx'
import Shell from '../lib/shell.jsx'

const nav_urls = [
	[ 'GitHub', 'https://github.com/barroit' ],
	[ 'Crap',   'https://crap.barroit.sh'    ],
]

const page_anchors = [
	[ 'intro',          LinkIntern, '#intro'                 ],
	[ 'log',            LinkIntern, '#log'                   ],
	[ 'gallery',        LinkIntern, '#gallery'               ],
	[ 'highlight',      LinkIntern, '#highlight'             ],
	[ 'commits',        LinkIntern, '#commits'               ],
	[ 'credit',         LinkIntern, '#credit'                ],
	[ 'y25.barroit.sh', LinkExtern, 'https://y25.barroit.sh' ],
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

function Banner()
{
	const links = nav_urls.map(fmt_link)

RETURN_JSX_BEGIN
<div class='pt-5'>
  <header class='px-2 md:flex justify-between text-h2 md:text-2xl font-bold'>
    <div class='hidden md:block'>
      <pre class='hidden xl:block'>
        <code>let skyColor = memory.get("last_seen_sky");</code>
      </pre>
      <pre class='xl:hidden'>
        <code>memory.get("last_seen_sky");</code>
      </pre>
    </div>
    <nav class='flex justify-between gap-x-12 uppercase px-3'>
      { links }
    </nav>
  </header>
  <div class='mt-3 h-2 bg-miku-cyan drop-shadow-sm'></div>
</div>
RETURN_JSX_END
}

function Wordmark()
{

RETURN_JSX_BEGIN
<div class='w-full xl:min-w-max xl:space-y-5
            @container md:[container-type:normal]
            flex xl:block flex-col items-center gap-y-[3cqw] md:gap-y-5
            font-x14y20px_score_dozer uppercase select-none'>
  <div class='pt-[8cqw] md:pt-12 xl:pt-0 drop-shadow-sm
              leading-none text-[15cqw] md:text-[6.2rem]
              text-shadow-[-0.6cqw_0_#ed59a9,0.6cqw_0_#5bb8c4]
              md:text-shadow-[-0.3rem_0_#ed59a9,0.3rem_0_#5bb8c4]'>
    <span class='xl:pl-2 tracking-[4cqw] md:tracking-[2rem]'>barroi</span>
    <span>t</span>
  </div>
  <div class='w-full h-2 bg-miku-cyan drop-shadow-sm'></div>
  <div class='w-full px-1 font-x16y32px_grid_gazer font-bold text-zinc-800'>
    <p class='text-[4cqw] tracking-[0.4cqw]
              md:text-[1.6rem] md:tracking-[0.2rem]'>
      fast / scalable / no-bullshit engineering
    </p>
    <p class='max-w-max ml-auto italic
              text-[3.5cqw] tracking-[0.3cqw]
              md:text-[1.4rem] md:tracking-[0.15rem]'>
      powered by hatsune miku
    </p>
  </div>
</div>
RETURN_JSX_END
}

function MenuFrame()
{

RETURN_JSX_BEGIN
<>
  <div class='xl:absolute top-0 left-2 h-2 w-full
              flex items-center justify-between gap-x-[4vw] md:gap-x-7'>
    <div class='flex-1 h-2 bg-miku-cyan drop-shadow-sm'></div>
    <p class='capitalize font-bold text-h2 md:text-4xl'>sections</p>
    <div class='flex-1 xl:flex-5 h-2 bg-miku-cyan drop-shadow-sm'></div>
  </div>
  <div class='hidden xl:block absolute top-2 bottom-0
              w-2 bg-miku-cyan drop-shadow-sm'></div>
  <div class='hidden xl:block absolute top-0 left-0 size-2 bg-miku-cyan'></div>
</>
RETURN_JSX_END
}

function on_click_arrow(link)
{
	link.current.click()
}

function fmt_anchor([ name, Link, url ])
{
	const link = useRef()
	const on_click_arrow_fn = on_click_arrow.bind(undefined, link)

RETURN_JSX_BEGIN
<Link ref={ link } href={ url }
      class='group p-5 max-w-max flex items-center gap-x-1
             cursor-pointer no-underline! text-black!'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'
       onclick={ on_click_arrow_fn } fill='currentColor'
       class='h-8 w-auto rotate-90 transition
              group-hover:rotate-0 group-focus-visible:rotate-0
              group-hover:text-miku-pink group-focus-visible:text-miku-pink'>
    <path d='M640-480 400-720l-80 80 160 160-160 160 80 80 240-240Z'/>
  </svg>
  <div class='min-w-max font-bold text-h3 md:text-3xl transition
              group-hover:text-miku-pink group-focus-visible:rotate-0'>
  { Link == LinkExtern ? (
    <ExternMark class='after:-ml-2'>
      { name }
    </ExternMark>
  ) : (
    name
  )}
  </div>
</Link>
RETURN_JSX_END
}

function Body()
{
	const anchors = page_anchors.map(fmt_anchor)

RETURN_JSX_BEGIN
<div class='xl:mt-15 space-y-20 xl:space-y-0
            xl:grid gap-y-20 grid-cols-[1fr_auto] grid-rows-[auto_1fr]'>
  <div class='xl:pt-10 xl:min-w-144 max-h-min col-span-1'>
    <Wordmark/>
  </div>
  <div class='row-span-2 select-none'>
    <img src='AS_MIKU_NT_PNG' class='drop-shadow-[0_4px_4px_#0000003f]'/>
  </div>
  <div class='row-start-2 self-center xl:ml-15 xl:max-w-max
              flex flex-col items-center xl:block relative'>
    <MenuFrame/>
    <div class='pt-20 md:pt-10 xl:pt-15 xl:pl-15'>
      <nav class='space-y-10 md:space-y-0 xl:space-y-5
                  pl-10 md:pl-0 md:grid grid-cols-2 xl:block
                  *:odd:col-span-2 *:even:col-start-2'>
        { anchors }
        <div class='hidden md:invisible w-[40ch]'>.</div>
      </nav>
    </div>
  </div>
</div>
RETURN_JSX_END
}

export default function Hero()
{

RETURN_JSX_BEGIN
<section class='bg-miku [--angle:135deg] pb-10'>
  <Banner/>
  <Body/>
</section>
RETURN_JSX_END
}
