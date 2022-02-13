#!/bin/bash

yarn test $1 && yarn build $1 yarn calculate-hash $1 && yarn create-gif $1 && yarn deploy $1