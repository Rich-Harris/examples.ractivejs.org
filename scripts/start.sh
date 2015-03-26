#!/bin/sh

set -e

rm -rf .build
node_modules/.bin/gobble build .build
node_modules/.bin/forever .build/app.js
