/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useRef, useState } from 'preact/hooks'

import useCachedState from '../lib/state.js'
import Bar from '../lib/bar.jsx'
import SVGIcon from '../lib/svg.jsx'

const year_offset = media_map[0][0]
const year_tab = media_map.map(([ year ]) => year)

for (const media of media_map)
	media[0] = undefined

function init_year_idx()
{
	const idx_str = localStorage.getItem('photo_year_idx')

	if (!idx_str)
		return year_tab.length - 1

	const idx = Number(idx_str)

	if (idx < 0 || idx >= year_tab.length)
		return year_tab.length - 1

	return idx
}

function restore_pos_tab()
{
	const arr_str = localStorage.getItem('photo_pos_tab')

	if (!arr_str)
		return

	let arr

	try {
		arr = JSON.parse(arr_str)
	} catch {
		return
	}

	if (!Array.isArray(arr))
		return

	if (arr.length != media_map.length)
		return

	let idx

	for (idx = 0; idx < arr.length; idx++)
		arr[idx] = Math.min(arr[idx], media_map[idx].length - 1)

	return arr
}

function init_pos_tab()
{
	const cache = restore_pos_tab()

	if (cache)
		return cache

	const arr = new Array(media_map.length)

	arr.fill(1)
	return arr
}

function init_loop()
{
	const loop = localStorage.getItem('photo_loop')

	switch (loop) {
	case '1':
	case '0':
		return Number(loop)

	default:
		return 1
	}
}

function Year({ children, onclick, ...props })
{
	APPEND_CLASS(props, 'p-2 font-bold transition duration-100 \
			     HOT(text-[MIKU_PINK]) HOT(-translate-y-1) \
			     ACTIVE(translate-y-0) \
			     ACTIVE(scale-90, pointer-coarse:)')

RETURN_JSX_BEGIN
<button inert={ !children } onclick={ onclick }>
  <div { ...props }>
    <h3 style={ { visibility: children ? 'visible' : 'hidden' } }
        class='origin-bottom leading-none'>
      { children || 3939 }
    </h3>
  </div>
</button>
RETURN_JSX_END
}

function on_click_year(event, set_idx)
{
	const year_str = CHILD_TEXT_OF(event.currentTarget)
	const year = Number(year_str)

	set_idx(year - year_offset)
}

function YearKnob({ year_idx, set_year_idx })
{
	const fill_years_fn = (_, i) => year_tab[year_idx - 2 + i]
	const years = Array.from({ length: 5 }, fill_years_fn)
	const onclick = event => on_click_year(event, set_year_idx)

RETURN_JSX_BEGIN
<div class='flex items-center justify-around text-xl'>
  <Year class='hidden lg:block *:scale-60' { ...{ onclick } }>
    { years[0] }
  </Year>
  <Year class='*:scale-80' { ...{ onclick } }>
    { years[1] }
  </Year>
  <div class='px-5 font-bold
              before:content-["["] before:pr-2 before:text-miku-pink
              after:content-["]"] after:pl-2 after:text-miku-pink'>
    { years[2] }
  </div>
  <Year class='*:scale-80' { ...{ onclick } }>
    { years[3] }
  </Year>
  <Year class='hidden lg:block *:scale-60' { ...{ onclick } }>
    { years[4] }
  </Year>
</div>
RETURN_JSX_END
}

async function img_onload(node, set_busy)
{
	try {
		await node.current.decode()
	} finally {
		set_busy(0)
	}
}

function video_onload(set_busy)
{
	console.log(11)
	set_busy(0)
}

function Preview({ src, poster, set_visible, busy, set_busy, ...props })
{
	const node = useRef()

	useEffect(() =>
	{
		const observer = new IntersectionObserver(([ entry ]) =>
		{
			if (entry.isIntersecting)
				set_visible(1)
			else
				set_visible(0)
		})

		observer.observe(node.current)

		return () => observer.disconnect()
	}, [])

	APPEND_CLASS(props, 'max-h-full rounded-md transition delay-100 \
			     border-miku-pink/50 [--span:4px]')

	/*
	 * Don't render border on iPadOS/iOS, their video controls is wider than
	 * the video dimension.
	 */
	if (poster)
		APPEND_CLASS(props, 'xl:border-4 xl:mask-fade-edge')
	else
		APPEND_CLASS(props, 'border-4 mask-fade-edge')

	if (busy)
		APPEND_CLASS(props, 'brightness-39')

	const onload = img_onload.bind(undefined, node, set_busy)
	const onloadedmetadata = video_onload.bind(undefined, set_busy)
	const src_fb = src.replace(/webm$/, 'mp4')

RETURN_JSX_BEGIN
<>
{ !poster ? (
  <img ref={ node } { ...{ ...props, src, onload } }
       decoding='async' draggable={ 0 }/>
) : (
  <video ref={ node } controls preload='metadata'
         { ...{ ...props, poster, onloadedmetadata } }>
    <source { ...{ src } } type='video/webm'/>
    <source src={ src_fb } type='video/mp4'/>
  </video>
) }
{ !poster ? (
  <div class='absolute inset-0 flex'>
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
         fill='none' stroke='currentColor' stroke-width='2'
         class='m-auto size-24 opacity-0 data-busy:opacity-100
                text-zinc-300 animate-spin transition delay-100'
         data-busy={ busy ? '' : undefined }>
      <circle cx='12' cy='12' r='9' opacity='0.39'/>
      <circle cx='12' cy='12' r='9'
              stroke-dasharray='14 57' stroke-linecap='round'/>
    </svg>
  </div>
) : undefined }
</>
RETURN_JSX_END
}

function PreviewMask({ children })
{

RETURN_JSX_BEGIN
<div class='absolute inset-0 m-[4px] flex transition GROUP_HOT(bg-zinc-800/60)'>
  { children }
</div>
RETURN_JSX_END
}

function dialog_show(dialog, set_visible, keep_scroll_bar)
{
	if (keep_scroll_bar)
		document.documentElement.dataset.scrollbar = ''

	document.documentElement.dataset.dialog = ''
	set_visible(0)

	dialog.current.showModal()
}

function dialog_hide(dialog)
{
	dialog.current.close()
}

function dialog_onclose(set_visible, keep_scroll_bar)
{
	if (keep_scroll_bar)
		delete document.documentElement.dataset.scrollbar

	delete document.documentElement.dataset.dialog
	set_visible(1)
}

function Showcase({ dialog, children, ...props })
{

RETURN_JSX_BEGIN
<dialog ref={ dialog } { ...props }
        class='p-10 max-w-none max-h-none w-screen h-[100dvh] open:flex
               bg-miku [--direction:to_bottom_right] select-none
               *:max-h-full *:m-auto *:object-contain *:drop-shadow-lg
               *:border-4 *:border-luka-pink *:mask-fade-edge *:[--span:4px]'>
  { children }
</dialog>
RETURN_JSX_END
}

function Video({ src, poster, set_visible, set_busy })
{

RETURN_JSX_BEGIN
<div class='relative'>
  <Preview { ...{ src, poster, set_visible, set_busy } } class='size-full'/>
</div>
RETURN_JSX_END
}

function Photo({ src, dialog, set_visible, busy, set_busy })
{
	const open = dialog_show.bind(undefined, dialog, set_visible, 0)
	const close = dialog_hide.bind(undefined, dialog)
	const onclose = dialog_onclose.bind(undefined, set_visible, 0)

RETURN_JSX_BEGIN
<div>
  <button onclick={ open } class='group relative size-full outline-none'>
    <Preview { ...{ src, set_visible, busy, set_busy } }/>
    <PreviewMask>
      <SVGIcon src='IMAGES_GOOGLE_OPEN_IN_FULL_SVG'
               class='m-auto p-2 bg-gray-200 opacity-0 transition
                      GROUP_HOT(opacity-100) *:size-6 *:bg-gray-700'/>
    </PreviewMask>
  </button>
  <Showcase onclick={ close } { ...{ dialog, onclose } }>
    <img { ...{ src } } decoding='async' draggable={ 0 }/>
  </Showcase>
</div>
RETURN_JSX_END
}

function Control({ onclick, ...props })
{
	APPEND_CLASS(props, 'p-1 lg:p-2 duration-100 GROUP_HOT(bg-zinc-400) \
			     GROUP_ACTIVE(scale-80) *:size-4 md:*:size-6')

RETURN_JSX_BEGIN
<button onclick={ onclick } class='group outline-none'>
  <SVGIcon { ...props }/>
</button>
RETURN_JSX_END
}

function LoopControl({ loop, set_loop, year_idx, photo_knob, ...props })
{
	const toggle_fn = prev => prev ^ 1
	const disable_fn = set_loop.bind(undefined, toggle_fn)

	useEffect(() =>
	{
		if (!loop)
			return

		const on_timer = () => LAST_CHILD_OF(photo_knob.current).click()
		const timer = setInterval(on_timer, 3939)

		return () => clearInterval(timer)
	}, [ year_idx, loop ])

	if (loop)
		APPEND_CLASS(props, '*:bg-meiko-red *:duration-0')
	else
		APPEND_CLASS(props, '*:bg-black')

RETURN_JSX_BEGIN
<Control src='IMAGES_GOOGLE_AUTOPLAY_SVG' onclick={ disable_fn } { ...props }/>
RETURN_JSX_END
}

function OpenControl({ dialog, video })
{
	const props = {}

	if (!video)
		APPEND_CLASS(props, '*:bg-black')
	else
		APPEND_CLASS(props, '*:bg-gray-400')

	props.onclick = () => PREV_SIBLING_OF(dialog.current).click()

RETURN_JSX_BEGIN
<>
  <div inert={ video } class='hidden pointer-coarse:flex'>
    <Control src='IMAGES_GOOGLE_OPEN_IN_FULL_SVG' { ...props }/>
  </div>
  <div class='pointer-coarse:hidden flex gap-x-8
              [&_*_*]:size-6 [&_*_*]:bg-rin-orange/70'>
    <SVGIcon src='IMAGES_BARROIT_2020_CLOVER_SVG'/>
    <SVGIcon src='IMAGES_BARROIT_2021_FLOWER_SVG'/>
    <SVGIcon src='IMAGES_BARROIT_2022_PENTAGRAM_SVG'/>
    <SVGIcon src='IMAGES_BARROIT_2025_OCTAGRAM_SVG'/>
  </div>
</>
RETURN_JSX_END
}

function on_img_click(dialog, set_pos_tab, set_loop, event)
{
	const img = CHILD_OF(event.currentTarget)
	const box = PARENT_OF(event.currentTarget)

	const year_idx = Number(box.dataset.idx) ?? year_tab.length - 1
	const new_pos = Number(img.dataset.idx) ?? 1

	const map_fn = (val, idx) => idx != year_idx ? val : new_pos
	const bump_pos_tab_fn = prev => [ ...prev ].map(map_fn)

	set_pos_tab(bump_pos_tab_fn)
	dialog_hide(dialog)
	set_loop(0)
}

function ExplandControl({ year_idx, set_visible, set_pos_tab, set_loop })
{
	const dialog = useRef()
	const open = dialog_show.bind(undefined, dialog, set_visible, 1)
	const close = dialog_hide.bind(undefined, dialog)
	const onclose = dialog_onclose.bind(undefined, set_visible, 1)

	const jump = on_img_click.bind(undefined, dialog, set_pos_tab, set_loop)

	let media = media_map[year_idx]
	const pad_size = (3 - (media.length - 1) % 3) % 3

	if (pad_size) {
		const pad = new Array(pad_size)

		pad.fill(0)
		media = [ ...media, ...pad ]
	}

RETURN_JSX_BEGIN
<div class='flex items-center'>
  <Control src='IMAGES_GOOGLE_EXPAND_ALL_SVG'
           class='*:bg-black' onclick={ open }/>
  <dialog ref={ dialog } autofocus onclick={ close } { ...{ onclose } }
          class='m-auto max-w-xl max-h-none h-[100dvh] md:h-[95dvh] bg-miku
                 md:border-4 border-luka-pink md:mask-fade-edge [--span:4px]'>
    <div data-idx={ year_idx }
         class='p-1 grid grid-cols-3 gap-[1px] overflow-auto'>
    { media.map((url, idx) => url == 0 ? (
      <div></div>
    ) : !url ? undefined : (
      <button onclick={ jump }
              class='group
                     nth-[3n+1]:*:origin-left
                     nth-[3n]:*:origin-right
                     nth-1:*:origin-top-left!
                     nth-2:*:origin-top!
                     nth-3:*:origin-top-right!
                     nth-last-3:*:origin-bottom-left!
                     nth-last-2:*:origin-bottom!
                     nth-last-1:*:origin-bottom-right!'>
        <img src={ url[1] } data-idx={ idx } draggable={ 0 }
             class='aspect-square object-cover select-none
                    transition-all outline-miku-cyan
                    GROUP_HOT(scale-120) GROUP_HOT(outline-2)
                    GROUP_ACTIVE(scale-none)
                    GROUP_ACTIVE(scale-80, pointer-coarse:)'/>
      </button>
    )) }
    </div>
  </dialog>
</div>
RETURN_JSX_END
}

function Thumbnail({ src, onclick, children, ...props })
{
	APPEND_CLASS(props, 'relative aspect-video rounded-md \
			     transition duration-100 \
			     GROUP_HOT(-translate-y-2) \
			     GROUP_ACTIVE(translate-0) \
			     GROUP_ACTIVE(scale-90, pointer-coarse:)')

RETURN_JSX_BEGIN
<button { ...{ onclick } } class='group size-full outline-none'>
  <div { ...props }>
    <img { ...{ src } } decoding='async' draggable={ 0 }
         class='size-full object-cover'/>
    { children }
  </div>
</button>
RETURN_JSX_END
}

function Prefetch({ src, ...props })
{
	const ref = useRef()

	useEffect(() => {fetch(src); console.log(src)}, [])

	props.ref = ref

RETURN_JSX_BEGIN
<div { ...props }></div>
RETURN_JSX_END
}

function on_thumb_click(new_pos, year_idx, set_loop,
			set_pos_tab, set_busy, event)
{
	const map_fn = (val, idx) => idx != year_idx ? val : new_pos
	const bump_pos_tab_fn = prev => [ ...prev ].map(map_fn)

	if (event.isTrusted)
		set_loop(0)

	set_busy(1)
	set_pos_tab(bump_pos_tab_fn)
}

divert(-1)

define(__PHOTO_ARROW,
       $1:absolute $1:-inset-y-1 $1:-$2-5 $1:w-2 $1:pointer-events-none \
       $1:border-$3-[.2rem] $1:border-y-[.2rem] $1:border-miku-pink)

define(PHOTO_ARROW, [[__PHOTO_ARROW($1, $2, substr($2, 0, 1))]])

divert(0)dnl
dnl
function PhotoKnob({ year_idx, pos, loop, set_loop,
		     set_pos_tab, photo_knob, busy, set_busy })
{
	const media = media_map[year_idx]
	const idx = pos - 1
	const len = (media.length - 1)

	const l_pos = (idx + len - 1) % len + 1
	const r_pos = (idx + 1) % len + 1

	const args = [ year_idx, set_loop, set_pos_tab, set_busy ]
	const l_args = [ undefined, l_pos, ...args ]
	const r_args = [ undefined, r_pos, ...args ]

	const l_fn = on_thumb_click.bind(...l_args)
	const r_fn = on_thumb_click.bind(...r_args)

	const l_props = {}
	const m_props = {}
	const r_props = {}
	const lr_style = 'h-8 lg:h-16 border-2 border-rin-orange \
			  GROUP_HOT(scale-120) *:rounded-sm *:brightness-39'

	APPEND_CLASS(l_props, lr_style)
	APPEND_CLASS(l_props, 'origin-bottom-right PHOTO_ARROW(before, left) \
			       GROUP_HOT(-translate-x-2)')

	APPEND_CLASS(r_props, lr_style)
	APPEND_CLASS(r_props, 'origin-bottom-left PHOTO_ARROW(after, right) \
			       GROUP_HOT(translate-x-2)')

	APPEND_CLASS(m_props, 'size-full ring-2 ring-rin-orange *:rounded-md')

	if (loop)
		APPEND_CLASS(r_props, 'translate-x-1 -translate-y-1 scale-110')

	if (!busy) {
		l_props.onclick = l_fn
		r_props.onclick = r_fn
	}

RETURN_JSX_BEGIN
<div ref={ photo_knob } class='w-fit flex items-end gap-x-2 select-none'>
  <Thumbnail src={ media[l_pos][1] } { ...l_props }>
    <link rel='prefetch' href={ media[l_pos][0] } as='image'/>
  </Thumbnail>
  <div inert class='h-12 lg:h-24'>
    <Thumbnail src={ media[pos][1] } { ...m_props }/>
  </div>
  <Thumbnail src={ media[r_pos][1] } { ...r_props }>
    <link rel='prefetch' href={ media[l_pos][0] } as='image'/>
  </Thumbnail>
</div>
RETURN_JSX_END
}

export default function Gallery()
{
	const [ year_idx, set_year_idx ] = useCachedState(init_year_idx,
							  'photo_year_idx')
	const [ pos_tab, set_pos_tab ] = useCachedState(init_pos_tab,
							'photo_pos_tab')
	const [ loop, set_loop ] = useCachedState(init_loop, 'photo_loop')

	const [ visible, set_visible ] = useState(1)
	const [ busy, set_busy ] = useState(1)

	const photo_knob = useRef()
	const dialog = useRef()

	const pos = pos_tab[year_idx]
	const media = media_map[year_idx]

	const photo = media[pos]
	const video = +photo[0].endsWith('.webm')

RETURN_JSX_BEGIN
<section id='gallery'
         class='space-y-5 *:mx-auto *:max-w-lg lg:*:max-w-5xl
                [--pastel-left:var(--pastel-green)]
                [--pastel-mid:var(--pastel-lavender)]
                [--pastel-right:var(--pastel-orange)]'>
  <div>
    <YearKnob { ...{ year_idx, set_year_idx } }/>
  </div>
  <div>
    <Bar class='mx-auto h-15' vertical/>
    <div class='mx-auto -translate-y-0.5 size-3
                rounded-full border-3 border-miku-pink select-none'></div>
    <Bar class='mt-5 mx-5 md:mx-10'/>
  </div>
  <div class='mt-15 lg:mt-20 px-10 w-fit select-none'>
    <div class='relative drop-shadow-lg *:h-60 lg:*:h-120'>
    { !video ? (
      <Photo src={ photo[0] } { ...{ dialog, set_visible, busy, set_busy } }/>
    ) : (
      <Video src={ photo[0] } poster={ photo[1] }
             { ...{ set_visible, set_busy } }/>
    ) }
    </div>
  </div>
  <div>
    <div class='mx-auto mb-10 mt-15 lg:mt-20 p-1 lg:p-2
                max-w-55 lg:max-w-none lg:w-lg
                flex items-center justify-between
                rounded-full bg-zinc-200/50 shadow-sm'>
      <LoopControl loop={ loop && visible }
                   { ...{ year_idx, set_loop, photo_knob } }/>
      <OpenControl { ...{ dialog, video } }/>
      <ExplandControl { ...{ year_idx, set_visible, set_pos_tab, set_loop } }/>
    </div>
  </div>
  <div>
    <Bar class='mx-5 md:mx-10'/>
    <div class='mx-auto mt-5 translate-y-0.5 size-3
                rounded-full border-3 border-miku-pink select-none'></div>
    <Bar class='mx-auto h-15' vertical/>
  </div>
  <PhotoKnob { ...{ year_idx, pos, loop, set_loop,
                    set_pos_tab, photo_knob, busy, set_busy } }/>
</section>
RETURN_JSX_END
}
