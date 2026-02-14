#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

git config lfs.standalonetransferagent image39
git config lfs.customtransfer.image39.path lfs-rclone.sh
git config lfs.customtransfer.image39.args wasabi:image39
git config lfs.customtransfer.image39.concurrent false
