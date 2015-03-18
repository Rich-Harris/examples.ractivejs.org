#!/bin/sh

rm -rf .build
node_modules/.bin/gobble build .build
node .build/app.js