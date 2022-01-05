#!/bin/bash
find . -type f -name "*.PNG" -exec rename 's/\.PNG$/.png/' '{}' \;