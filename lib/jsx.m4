dnl SPDX-License-Identifier: GPL-3.0-or-later
dnl
divert(-1)

define(RETURN_JSX_BEGIN, [[return (]])
define(RETURN_JSX_END, [[)]])

define(MIKU_PINK, var(--color-miku-pink))
define(MIKU_CYAN, var(--color-miku-cyan))

define(HOT, $2hover:$1 $2focus-visible:$1)
define(GROUP_HOT, HOT($1, group-))
define(GROUP_HOT_CHILD, HOT($1, *:group-))

define(APPEND_CLASS, if ($1.class) $1.class += ` ${$2}`; else $1.class = $2;)

divert(0)dnl
