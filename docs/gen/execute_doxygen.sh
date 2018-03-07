#!/bin/bash
# Author: Jack Cole jcole2@mail.sfsu.edu
# Linux uses forward slashes while windows uses backslashes. This can cause problems with directories, which this script aims to fix.
( cat doxygen.cfg ; echo "OUTPUT_DIRECTORY=../\n"; echo "INPUT = ../../" ) | doxygen -