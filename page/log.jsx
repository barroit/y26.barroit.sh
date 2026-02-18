/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Bar from '../lib/bar.jsx'

include(build/resume.js)dnl

function Work({ name, skill })
{

RETURN_JSX_BEGIN
<div class='relative *:ml-14'>
  <div class='flex items-center'>
    <Bar class='absolute left-1 w-7'/>
    <Bar class='absolute left-0 w-1' shadow=''/>
    <div class='absolute left-7.5 size-2 rounded-full
                border-2 border-miku-pink'></div>
    <div>{ name }</div>
  </div>
  <div class='relative mt-1'>
    <Bar class='absolute top-0 bottom-0' vertical color='bg-zinc-300'/>
    <div class='ml-[1ch]'>
      <div class='text-zinc-600 text-sm'>{ skill }</div>
    </div>
  </div>
</div>
RETURN_JSX_END
}

function Group({ year, children })
{

RETURN_JSX_BEGIN
<div class='relative pb-12'>
  <Bar class='absolute top-0 bottom-0' vertical/>
  <div class='ml-7 mb-6 flex items-center'>
    <div class='absolute -left-0.5 size-2 rounded-full bg-miku-pink'></div>
    <div class='font-bold'>{ year }</div>
  </div>
  <div class='space-y-6'>
    { children }
  </div>
</div>
RETURN_JSX_END
}

function fmt_work([ name, skill ])
{

RETURN_JSX_BEGIN
<Work name={ name } skill={ skill }/>
RETURN_JSX_END
}

function fmt_group([ year, ...work ])
{
	const works = work.map(fmt_work)

RETURN_JSX_BEGIN
<Group year={ year }>
  { works }
</Group>
RETURN_JSX_END
}

export default function Log()
{
	const groups = history.map(fmt_group)

RETURN_JSX_BEGIN
<section id='log'>
  <div class='mx-auto pl-5 lg:px-5 lg:columns-2 max-w-sm lg:max-w-4xl gap-50'>
    <div class='relative pb-6'>
      <Bar class='w-5 -translate-x-2'/>
      <Bar class='absolute top-1 bottom-0' vertical/>
    </div>
    { groups }
  </div>
</section>
RETURN_JSX_END
}
