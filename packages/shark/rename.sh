#!/bin/bash

# Utility script to rename file extensions outputed by Krita

# {file}.PNG -> {file}.png

find ./collections -name '*.PNG' -exec rename .PNG .png {} +