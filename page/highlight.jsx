/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useState } from 'preact/hooks'

import Bar from '../lib/bar.jsx'
import useMobile from '../lib/device.js'
import Flick from '../lib/flick.jsx'
import { LinkExtern, ExternMark } from '../lib/link.jsx'
import useCachedState from '../lib/state.js'
import SVGIcon from '../lib/svg.jsx'
import { time_span_now, time_to_approx } from '../lib/time.js'

function init_mid()
{
	const mid_str = localStorage.getItem('highlight_mid')

	if (!mid_str)
		return 0

	const mid = Number(mid_str)

	if (mid < 0 || mid > 6)
		return 0

	return mid
}

function LabelFrame({ icon, children, ...props })
{
	APPEND_CLASS(props, 'grid grid-cols-[max-content_1fr] items-start')

RETURN_JSX_BEGIN
<div { ...props }>
  { children }
</div>
RETURN_JSX_END
}

function IconLabelFrame({ icon, children, ...props })
{

RETURN_JSX_BEGIN
<LabelFrame { ...props }>
  <div class='flex items-center before:content-["\200b"]'>
    <img class='h-4 select-none' src={ icon } draggable={ 0 }/>
  </div>
  { children }
</LabelFrame>
RETURN_JSX_END
}

function Label({ icon, prefix, pad, suffix, ...props })
{
	APPEND_CLASS(props, 'gap-x-3')

	const spaces = ' '.repeat(pad)
	const style = { '--pad': `'${spaces}'` }

RETURN_JSX_BEGIN
<IconLabelFrame { ...{ icon, ...props } }>
  <div class='whitespace-pre'>
    <span class='font-bold after:content-(--pad)' { ...{ style } }>
      { prefix }
    </span>
    <span class='opacity-0'> </span>
    <span>{ suffix }</span>
  </div>
</IconLabelFrame>
RETURN_JSX_END
}

function LinkLabel({ url, name, ...props })
{
	const mobile = useMobile()

RETURN_JSX_BEGIN
<IconLabelFrame { ...props }>
  <LinkExtern href={ url } class='text-indigo-700'>
    <ExternMark>
    { mobile ? (
      <span>{ name }</span>
    ) : (
      <Flick>{ name }</Flick>
    ) }
    </ExternMark>
  </LinkExtern>
</IconLabelFrame>
RETURN_JSX_END
}

function BusyBar(props)
{
	APPEND_CLASS(props, 'relative w-full')

RETURN_JSX_BEGIN
<div { ...props }>
  <div class='invisible'>39</div>
  <div class='absolute inset-x-0 inset-y-0.5 rounded-xs shadow-sm
              bg-zinc-300/50 not-in-[.masking]:animate-pulse'></div>
</div>
RETURN_JSX_END
}

function BusyLabel(props)
{

RETURN_JSX_BEGIN
<IconLabelFrame { ...props }>
  <BusyBar/>
</IconLabelFrame>
RETURN_JSX_END
}

function Head({ url, name, desc })
{

RETURN_JSX_BEGIN
<div>
  <LinkLabel icon='AS_BOOK_2_SVG'
             class='gap-x-1 text-xl font-bold' { ...{ url, name } }/>
  <div class='mt-1 flex'>
    <Bar color='ml-1.5 bg-zinc-300' vertical/>
    <p class='ml-2.5 text-zinc-600'>{ desc }</p>
  </div>
</div>
RETURN_JSX_END
}

function History({ commits, lines })
{
	let commits_pad = 0
	let lines_pad = 0

	commits = commits.toLocaleString('en-US')
	lines = lines.toLocaleString('en-US')

	const commits_len = commits.length
	const lines_len = lines.length

	const pad_raw = Math.max(commits_len, lines_len)
	const pad = Math.min(pad_raw, 6)

	if (commits_len < pad)
		commits_pad = pad - commits_len

	if (lines_len < pad)
		lines_pad = pad - lines_len

RETURN_JSX_BEGIN
<>
  <Label icon='AS_COMMIT_SVG'
         prefix={ commits } pad={ commits_pad } suffix='commits'/>
  <Label icon='AS_CODE_SVG'
         prefix={ lines } pad={ lines_pad } suffix='lines'/>
</>
RETURN_JSX_END
}

function FakeHistory()
{

RETURN_JSX_BEGIN
<>
  <BusyLabel icon='AS_COMMIT_SVG' class='gap-x-3'/>
  <BusyLabel icon='AS_CODE_SVG' class='gap-x-3'/>
</>
RETURN_JSX_END
}

function DeadHistory()
{

RETURN_JSX_BEGIN
<>
  <IconLabelFrame icon='AS_CLOUD_OFF_SVG' class='gap-x-3'>
    <p>commit's offline</p>
  </IconLabelFrame>
  <IconLabelFrame icon='AS_CLOUD_OFF_SVG' class='gap-x-3'>
    <p>line's offline</p>
  </IconLabelFrame>
</>
RETURN_JSX_END
}

function Past({ since })
{
	const date = new Date(since)
	const span = time_span_now(date)

	const [ dt, time ] = time_to_approx(span)
	const past = `${time}${dt}`

RETURN_JSX_BEGIN
<Label icon='AS_UPDATE_SVG' prefix={ past } suffix='ago'/>
RETURN_JSX_END
}

function Docs({ url, ...props })
{
	APPEND_CLASS(props, 'gap-x-3')

	let name = url.replace(/^https?:\/\//, '')

	if (name.endsWith('/'))
		name = name.slice(0, name.length - 1)

RETURN_JSX_BEGIN
<LinkLabel icon='AS_LINK_2_SVG' { ...{ url, name, ...props } }/>
RETURN_JSX_END
}

function fmt_tag(tag, idx)
{

RETURN_JSX_BEGIN
<>
  <span>{ tag }</span>
{ idx + 1 != this ?  (
  <span class='text-miku-cyan font-bold'> / </span>
) : undefined }
</>
RETURN_JSX_END
}

function Topic({ list, ...props })
{
	APPEND_CLASS(props, 'gap-x-3')

	const tags = list.map(fmt_tag, list.length)

RETURN_JSX_BEGIN
<IconLabelFrame icon='AS_SELL_SVG' { ...props }>
  <div>
    { tags }
  </div>
</IconLabelFrame>
RETURN_JSX_END
}

function Lang({ name, color, ...props })
{
	APPEND_CLASS(props, 'gap-x-3')

RETURN_JSX_BEGIN
<LabelFrame { ...props }>
    <div class='mx-0.5 my-auto size-3 rounded-full bg-(--color) select-none'
         style={ { '--color': color } }></div>
  <p>{ name }</p>
</LabelFrame>
RETURN_JSX_END
}

function Card({ url, name, desc, lang, topic, docs, history, pushed, ...props })
{
	APPEND_CLASS(props, 'p-4 rounded-md shadow-sm bg-zinc-200/39')

RETURN_JSX_BEGIN
<div { ...props }>
  <Head { ...{ url, name, desc } }/>
  <div class='mt-4 grid grid-cols-[7fr_4fr] md:grid-cols-[4fr_7fr]
              gap-x-4 lg:gap-x-10 gap-y-2 text-sm'>
    <div class='row-span-2 space-y-2'>
    { !history ? (
      <DeadHistory/>
    ) : history.commits ? (
      <History commits={ history.commits } lines={ history.lines }/>
    ) : (
      <FakeHistory/>
    ) }
    </div>
    <div class='invisible md:hidden'>39</div>
    <Past since={ pushed }/>
    <Docs url={ docs } class='col-span-2 md:col-span-1 break-all'/>
    <Topic list={ topic } class='col-span-2'/>
    <Lang { ...lang } class='mt-2'/>
  </div>
</div>
RETURN_JSX_END
}

function CardMaskIcon({ ...props })
{
RETURN_JSX_BEGIN
<SVGIcon { ...props }
         class='m-auto -rotate-45 opacity-0 pointer-coarse:opacity-100
                bg-zinc-300 transition GROUP_HOT(opacity-100)
                GROUP_ACTIVE(scale-80, pointer-coarse:)
                *:size-16 *:bg-rin-orange'/>
RETURN_JSX_END
}

function CardMask({ children })
{

RETURN_JSX_BEGIN
<div class='absolute inset-0 flex rounded-md shadow-md bg-zinc-200/80'>
  { children }
</div>
RETURN_JSX_END
}

function CardBtn({ children, ...props })
{
	APPEND_CLASS(props, 'group outline-none flex items-center \
			     transition ACTIVE(translate-0)')

RETURN_JSX_BEGIN
<button { ...props }>
  <div class='relative w-full'>
    { children }
  </div>
</button>
RETURN_JSX_END
}

function CardControl({ to_left, to_right, ...props })
{
	APPEND_CLASS(props, 'grid grid-cols-[1fr_2px_1fr] rounded-full \
			     shadow-sm bg-zinc-200/39 *:odd:transition \
			     ACTIVE(scale-80, *:odd:)')

RETURN_JSX_BEGIN
<div { ...props }>
  <button onclick={ to_left }>
    <img src='AS_CHEVRON_BACKWARD_SVG' class='mx-auto size-8 select-none'/>
  </button>
  <Bar vertical/>
  <button onclick={ to_right }>
    <img src='AS_CHEVRON_FORWARD_SVG' class='mx-auto size-8 select-none'/>
  </button>
</div>
RETURN_JSX_END
}

function Cards({ pinned, mid, set_mid })
{
	const left = (mid + pinned.length - 1) % pinned.length
	const right = (mid + 1) % pinned.length

	const to_left = () => set_mid(left)
	const to_right = () => set_mid(right)

RETURN_JSX_BEGIN
<div>
  <div class='lg:grid grid-rows-3 gap-y-15 *:w-full lg:*:w-xl
              *:odd:scale-55 *:odd:hidden lg:*:odd:block'>
    <CardBtn onclick={ to_left } class='HOT(-translate-2)'>
      <Card inert { ...pinned[left] } class='masking'/>
      <CardMask>
        <CardMaskIcon src='AS_KEYBOARD_ARROW_UP_SVG'/>
      </CardMask>
    </CardBtn>
    <div class='place-self-center h-75 md:h-auto'>
      <Card { ...pinned[mid] }/>
    </div>
    <CardBtn onclick={ to_right } class='place-self-end HOT(translate-2)'>
      <Card inert { ...pinned[right] } class='masking'/>
      <CardMask>
        <CardMaskIcon src='AS_KEYBOARD_ARROW_DOWN_SVG'/>
      </CardMask>
    </CardBtn>
  </div>
  <div class='mt-10 px-5 lg:hidden'>
    <CardControl { ...{ to_left, to_right } }/>
  </div>
</div>
RETURN_JSX_END
}

function FakeHead()
{

RETURN_JSX_BEGIN
<div>
  <BusyLabel icon='AS_BOOK_2_SVG' class='gap-x-1 text-xl font-bold'/>
  <div class='mt-1 flex'>
    <Bar color='ml-1.5 bg-zinc-300' vertical/>
    <BusyBar class='ml-2.5'/>
  </div>
</div>
RETURN_JSX_END
}

function FakeCard(props)
{
	APPEND_CLASS(props, 'p-4 rounded-md shadow-sm bg-zinc-200/39')

RETURN_JSX_BEGIN
<div { ...props }>
  <FakeHead/>
  <div class='mt-4 grid grid-cols-[7fr_4fr] md:grid-cols-none
              gap-x-4 lg:gap-x-10 gap-y-2 text-sm'>
    <div class='row-span-2 space-y-2'>
      <FakeHistory/>
    </div>
    <div class='invisible md:hidden'>39</div>
    <BusyLabel icon='AS_UPDATE_SVG' class='gap-x-3'/>
    <BusyLabel icon='AS_LINK_2_SVG' class='col-span-2 md:col-span-1 gap-x-3'/>
    <BusyLabel icon='AS_SELL_SVG' class='col-span-2 gap-x-3'/>
    <BusyBar class='mt-2'/>
  </div>
</div>
RETURN_JSX_END
}

function FakeCards()
{

RETURN_JSX_BEGIN
<div inert>
  <div class='lg:grid grid-rows-3 gap-y-15 *:w-full lg:*:w-xl
              *:odd:scale-55 *:odd:hidden lg:*:odd:block'>
    <div class='relative'>
      <FakeCard class='masking'/>
      <CardMask/>
    </div>
    <div class='place-self-center h-75 md:h-auto'>
      <FakeCard/>
    </div>
    <div class='place-self-end relative'>
      <FakeCard class='masking'/>
      <CardMask/>
    </div>
  </div>
  <div class='mt-10 px-5 lg:hidden'>
    <CardControl/>
  </div>
</div>
RETURN_JSX_END
}

function DeadCards()
{

RETURN_JSX_BEGIN
<div class='flex p-20'>
  <div class='m-auto px-6 py-4 flex items-center gap-x-6
              rounded-md bg-zinc-200/39 shadow-md'>
    <img src='AS_FROWN_PNG' draggable={ 0 }
         class='size-16 drop-shadow-md select-none'/>
    <div>
      <p class='text-xl'>Sorry, but</p>
      <p>Highlight is broken</p>
    </div>
  </div>
</div>
RETURN_JSX_END
}

export default function Highlight()
{
	const [ pinned, set_pinned ] = useState([])
	const [ mid, set_mid ] = useCachedState(init_mid, 'highlight_mid')

	useEffect(async () =>
	{
		const res = await fetch('/q/highlight')
		let data

		if (res.status != 500)
			data = await res.json()

		set_pinned(data)
	}, [])

RETURN_JSX_BEGIN
<section id='highlight'
         class='[--pastel-left:var(--pastel-pink)]
                [--pastel-mid:var(--pastel-lavender)]
                [--pastel-right:var(--pastel-green)]'>
  <div class='mx-auto px-4 md:px-0 max-w-md lg:max-w-none'>
  { !pinned ? (
    <DeadCards/>
  ) : pinned.length ? (
    <Cards { ...{ pinned, mid, set_mid } }/>
  ) : (
    <FakeCards/>
  ) }
  </div>
</section>
RETURN_JSX_END
}
