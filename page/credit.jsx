/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Bar from '../lib/bar.jsx'
import useMobile from '../lib/device.js'
import Flick from '../lib/flick.jsx'
import { LinkExtern, ExternMark } from '../lib/link.jsx'
import Shell from '../lib/shell.jsx'
import SVGIcon from '../lib/svg.jsx'

function Field({ icon, children })
{ 

RETURN_JSX_BEGIN
<div class='flex items-center gap-x-3'>
  <SVGIcon src={ icon } class='*:size-6 *:bg-zinc-800'/>
  <p>{ children }</p>
</div>
RETURN_JSX_END
}

function List({ title, children, ...props })
{

RETURN_JSX_BEGIN
<div { ...props }>
  <p>{ title }</p>
  <div class='ml-1.5 mt-3 flex gap-x-2 text-sm'>
    <Bar color='bg-zinc-200' vertical/>
    { children }
  </div>
</div>
RETURN_JSX_END
}

function FieldList({ children, ...props })
{
	APPEND_CLASS(props, 'px-5 mx-auto space-y-2')

RETURN_JSX_BEGIN
<div { ...props }>
  { children }
</div>
RETURN_JSX_END
}

function fmt_notice([ path, href ])
{
	const mobile = useMobile()

RETURN_JSX_BEGIN
<>
  <p>{ path }</p>
  <Shell move={ 2 } class='w-fit'>
    <LinkExtern class='px-1' { ...{ href } }>
    { mobile ? (
      <span>README</span>
    ) : (
      <Flick>README</Flick>
    ) }
    </LinkExtern>
  </Shell>
</>
RETURN_JSX_END
}

function fmt_license([ path, href ])
{
	const mobile = useMobile()

RETURN_JSX_BEGIN
<div>
  <LinkExtern class='text-indigo-700' { ...{ href } }>
    <ExternMark>
    { mobile ? (
      <span>{ path }</span>
    ) : (
      <Flick>{ path }</Flick>
    ) }
    </ExternMark>
  </LinkExtern>
</div>
RETURN_JSX_END
}

export default function Credit()
{
	const notices = notice_map.map(fmt_notice)
	const licenses = license_map.map(fmt_license)

RETURN_JSX_BEGIN
<section id='credit'
         class='[--pastel-left:var(--pastel-green)]
                [--pastel-mid:var(--pastel-lavender)]
                [--pastel-right:var(--pastel-cyan)]'>
  <Bar/>
  <div class='mt-10 mx-auto p-5 w-fit flex flex-col lg:flex-row
              items-center lg:items-start gap-y-10 gap-x-20 text-zinc-700'>
    <div class='space-y-5'>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_LICENSE_SVG'>GPL-3.0-or-later</Field>
        <Field icon='IMAGES_GOOGLE_COPYRIGHT_SVG'>2026 Jiamu Sun</Field>
      </FieldList>
      <Bar color='bg-zinc-200'/>
      <FieldList>
        <Field icon='IMAGES_GOOGLE_HOME_REPAIR_SERVICE_SVG'>
          preact & tailwind
        </Field>
        <Field icon='IMAGES_GOOGLE_BUILD_SVG'>make & m4</Field>
        <Field icon='IMAGES_GOOGLE_DNS_SVG'>cloudflare workers</Field>
      </FieldList>
      <Bar color='bg-zinc-200'/>
    </div>
    <div class='space-y-10 lg:flex gap-y-10 gap-x-20'>
      <List title='Resources'>
        <div class='grid grid-cols-[auto_1fr] gap-x-6 gap-y-5'>
          { notices }
        </div>
      </List>
      <List title='Licenses'>
        <div class='space-y-5'>
          { licenses }
        </div>
      </List>
    </div>
  </div>
</section>
RETURN_JSX_END
}
