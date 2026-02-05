/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useState } from 'preact/hooks'
import { Temporal } from 'temporal-polyfill'

import Bar from '../lib/bar.jsx'
import Flick from '../lib/flick.jsx'
import { LinkExtern } from '../lib/link.jsx'

function Label({ children, src, ...props })
{
	const style = 'flex items-center gap-x-2'

	if (props.class)
		props.class += ` ${style}`
	else
		props.class = style

RETURN_JSX_BEGIN
<div { ...props }>
  <img class='h-5 select-none drop-shadow-sm' src={ src } draggable={ false }/>
  <p class='text-sm'>
    { children }
  </p>
</div>
RETURN_JSX_END
}

function BirthdayLabel()
{
	const birth_date = { year: 2005, month: 4, day: 6 }
	const birth = Temporal.PlainDateTime.from(birth_date)

	const now = Temporal.Now.plainDateTimeISO()
	const age = birth.until(now, { largestUnit: 'years' })

	const age_label = { years: 'year', months: 'month', days: 'day' }

	if (age.years > 1)
		age_label.years += 's'
	if (age.months > 1)
		age_label.months += 's'
	if (age.days > 1)
		age_label.days += 's'

RETURN_JSX_BEGIN
<Label src='AS_CAKE_SVG'>
    { age.years } { age_label.years }, {}
    { age.months } { age_label.months }, {}
    { age.days } { age_label.days }
</Label>
RETURN_JSX_END
}

function ClockLabel()
{
	const now_ref = Temporal.Now.zonedDateTimeISO
	const now_fn = now_ref.bind(undefined, 'Asia/Tokyo')
	const [ now, next ] = useState(now_fn)

	useEffect(() =>
	{
		const next_fn = next.bind(undefined, now_fn)
		const timer = setInterval(next_fn, 1000)

		return () => clearInterval(timer)
	}, [])

	const hour_str = now.hour + ''
	const minute_str = now.minute + ''

	const hour = hour_str.padStart(2, '0')
	const minute = minute_str.padStart(2, '0')

RETURN_JSX_BEGIN
<Label src='AS_SCHEDULE_SVG'>
  <span>{ hour }:{ minute } </span>
  <span class='text-zinc-500'>(UTC { now.offset })</span>
</Label>
RETURN_JSX_END
}

function Identity()
{

RETURN_JSX_BEGIN
<div class='flex items-center gap-x-10'>
  <img src='AS_AVATAR_SQUARE_JPG' draggable={ false }
       class='w-20 rounded-full drop-shadow-md select-none'/>
  <div>
    <p class='text-2xl font-bold'>
      Jiamu Sun
      <sup aria-hidden={ true }
           class='italic tracking-widest
                  font-x16y32px_grid_gazer text-miku-cyan'>
        {} 39
      </sup>
    </p>
    <div class='text-zinc-500'>
      <span class='text-xl'>barroit</span>
      <span class='ml-2 font-sans'>/ˈbɑːˌroʊrt/</span>
    </div>
  </div>
</div>
RETURN_JSX_END
}

function Status()
{

RETURN_JSX_BEGIN
<div class='space-y-5'>
  <BirthdayLabel/>
  <Label src='AS_MIC_SVG'>Chinese / English / Japanese</Label>
  <Label src='AS_LOCATION_ON_SVG'>Chiba Chuo</Label>
  <ClockLabel/>
  <Label src='AS_MAIL_SVG'>
    <LinkExtern href='mailto:barroit@linux.com' class='hover:underline'>
      <Flick>barroit@linux.com</Flick>
    </LinkExtern>
  </Label>
  <Label src='AS_SMS_SVG'>
    <LinkExtern href='https://x.com/barro1t' class='hover:underline'>
      <Flick>https://x.com/barro1t</Flick>
    </LinkExtern>
  </Label>
</div>
RETURN_JSX_END
}

function Song()
{

RETURN_JSX_BEGIN
<div class='flex items-center'>
  <img src='AS_METEOR_JPEG' draggable={ false }
       class='-mx-1 h-8 rounded-md drop-shadow-xs'/>
  <div class='ml-4 select-text'>
    <p class='font-bold'>METEOR</p>
    <p class='text-sm text-zinc-600'>DIVELA</p>
  </div>
  <div class='ml-auto flex items-center gap-1
              drop-shadow-xl *:bg-zinc-500 *:w-[2px]'>
    <div class='h-1'></div>
      <div class='h-5'></div>
      <div class='h-3'></div>
      <div class='h-7'></div>
      <div class='h-2'></div>
      <div class='h-4'></div>
  </div>
</div>
RETURN_JSX_END
}

function Progress()
{
RETURN_JSX_BEGIN
<div class='relative -mx-1'>
  <Bar class='rounded-full' shadow='drop-shadow-xs'/>
  <Bar class='absolute top-0 left-0 right-11/20 rounded-full'
       shadow='drop-shadow-none'
       color='bg-gradient-to-r from-rose-500 to-miku-pink'/>
  <div class='absolute -top-[calc(var(--spacing)*.5)] right-11/20
              size-2 rounded-full bg-rose-500'></div>
  <div class='mt-1 flex justify-between font-bold text-xs text-zinc-500'>
    <p>2:01</p>
    <p>4:31</p>
  </div>
</div>
RETURN_JSX_END
}

function Toolkit()
{

RETURN_JSX_BEGIN
<div class='flex justify-between items-center drop-shadow-sm opacity-80'>
  <img src='AS_SHUFFLE_SVG' draggable={ false } class='h-4'/>
  <div class='flex items-center gap-x-5'>
    <img src='AS_SKIP_PREVIOUS_SVG' draggable={ false } class='h-6'/>
    <LinkExtern href='https://youtu.be/2kZVEUGLgy4?t=121'>
      <img src='AS_PLAY_ARROW_SVG' draggable={ false }
           class='h-8 rounded-full motion-safe:transition
                  hover:bg-zinc-400 active:scale-80'/>
    </LinkExtern>
    <img src='AS_SKIP_NEXT_SVG' draggable={ false } class='h-6'/>
  </div>
  <img src='AS_REPEAT_ONE_SVG' draggable={ false } class='h-4'/>
</div>
RETURN_JSX_END
}

function Player()
{

RETURN_JSX_BEGIN
<div aria-hidden={ true }
     class='mx-2 px-5 py-2 select-none bg-zinc-200/50 rounded-xl space-y-2'>
  <Song/>
  <Progress/>
  <Toolkit/>
</div>
RETURN_JSX_END
}

export default function Intro()
{

RETURN_JSX_BEGIN
<section id='intro' class='space-y-15'>
  <div class='mx-auto w-fit space-y-10'>
    <Identity/>
    <Status/>
  </div>
  <Player/>
</section>
RETURN_JSX_END
}
