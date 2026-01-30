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
	[ 'Crap',   'https://crap.barroit.sh'    ],
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
    <nav class='px-3 flex justify-between
                md:justify-normal md:gap-x-12 uppercase'>
      { links }
    </nav>
  </header>
  <Bar class='mt-3'/>
</div>
RETURN_JSX_END
}

function Brand()
{
RETURN_JSX_BEGIN
<div class='pt-[8cqw] md:pt-12 xl:pt-0 max-w-max mx-auto xl:mx-0
            drop-shadow-sm leading-none text-[15cqw] md:text-[6.2rem]
            text-shadow-[-0.6cqw_0_#ed59a9,0.6cqw_0_#5bb8c4]
            md:text-shadow-[-0.3rem_0_#ed59a9,0.3rem_0_#5bb8c4]'>
  <span class='xl:pl-2 tracking-[4cqw] md:tracking-[2rem]'>
    barroi
  </span>
  <span>t</span>
</div>
RETURN_JSX_END
}

function Motto()
{
RETURN_JSX_BEGIN
<p class='text-[4cqw] md:text-[1.6rem] tracking-[0.39cqw] md:tracking-[0.2rem]'>
  fast / scalable / no-bullshit engineering
</p>
RETURN_JSX_END
}

function Signature()
{
RETURN_JSX_BEGIN
<p class='ml-auto w-max text-[3.7cqw] md:text-[1.5rem]
          tracking-[0.3cqw] md:tracking-[0.15rem] italic'>
  powered by hatsune miku
</p>
RETURN_JSX_END
}

function Masthead()
{

RETURN_JSX_BEGIN
<div class='xl:min-w-max @container md:[container-type:normal] select-none
            font-x14y20px_score_dozer uppercase space-y-[3cqw]
            md:space-y-5 xl:space-y-2 2xl:space-y-5'>
  <Brand/>
  <Bar/>
  <div class='pl-1 font-x16y32px_grid_gazer font-bold text-zinc-800'>
    <Motto/>
    <Signature/>
  </div>
</div>
RETURN_JSX_END
}

function MenuFrame()
{

RETURN_JSX_BEGIN
<>
  <div class='xl:absolute top-0 left-0 h-2 w-full
              flex items-center justify-between gap-x-[4vw] md:gap-x-7'>
    <Bar class='flex-1'/>
    <p class='text-h2 md:text-4xl font-bold capitalize'>sections</p>
    <Bar class='flex-1 xl:flex-3'/>
  </div>
  <Bar class='absolute top-2 bottom-0 hidden xl:block' vertical/>
  <div class='absolute top-0 left-0 size-2 hidden xl:block bg-miku-cyan'></div>
</>
RETURN_JSX_END
}

function on_click_arrow(link)
{
	link.current.click()
}

function EmptyAnchor()
{

RETURN_JSX_BEGIN
<div class='md:hidden'></div>
RETURN_JSX_END
}

function Anchor({ name, url })
{
	const link = useRef()
	const on_click_arrow_fn = on_click_arrow.bind(undefined, link)

RETURN_JSX_BEGIN
<LinkIntern ref={ link } href={ url }
      class='group p-2 max-w-max flex items-center gap-x-1
             text-black! no-underline! cursor-pointer'>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'
       onclick={ on_click_arrow_fn } fill='currentColor'
       class='h-8 rotate-90 transition
              group-hover:rotate-0 group-focus-visible:rotate-0
              group-hover:text-miku-pink group-focus-visible:text-miku-pink'>
    <path d='M640-480 400-720l-80 80 160 160-160 160 80 80 240-240Z'/>
  </svg>
  <div class='min-w-max text-h3 md:text-3xl font-bold transition
              group-hover:text-miku-pink group-focus-visible:rotate-0'>
    { name }
  </div>
</LinkIntern>
RETURN_JSX_END
}

function fmt_anchor([ name, url ])
{
	if (!name)
		return <EmptyAnchor/>
	else
		return <Anchor name={ name } url={ url }/>
}

function Body()
{
	const anchors = page_anchors.map(fmt_anchor)

RETURN_JSX_BEGIN
<div class='xl:mt-10 2xl:mt-10 xl:grid grid-cols-[1fr_auto] grid-rows-[auto_1fr]
            gap-10 2xl:gap-y-20 space-y-15 xl:space-y-0'>
  <div class='2xl:pt-10 xl:min-w-164 2xl:min-w-130 max-h-min'>

    <Masthead/>
  </div>
  <div class='row-span-2 select-none'>
    <img src='AS_MIKU_NT_PNG' class='drop-shadow-[0_4px_4px_#0000003f]'/>
  </div>
  <div class='row-start-2 relative 2xl:ml-20 xl:mt-10
              xl:max-w-max xl:max-h-max'>
    <MenuFrame/>
    <div class='mx-auto pt-15 2xl:pt-20 xl:pl-15 2xl:pl-20 max-w-max'>
      <nav class='grid 2xl:block grid-cols-2 md:gap-x-20 xl:gap-x-8
                  gap-y-8 *:odd:col-span-2 xl:*:odd:col-span-1
                  *:even:col-start-2 2xl:space-y-12'>
        { anchors }
        <div class='hidden xl:block invisible'>
          393939393939393939393939393939393939
        </div>
      </nav>
    </div>
  </div>
</div>
RETURN_JSX_END
}

export default function Hero()
{

RETURN_JSX_BEGIN
<section class='bg-miku [--angle:135deg]'>
  <Banner/>
  <Body/>
</section>
RETURN_JSX_END
}
