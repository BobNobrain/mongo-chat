#!/bin/bash

# http://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if ! [ -d "${DIR}/data" ]; then
	mkdir "${DIR}/data"
fi

if ! [ -d "${DIR}/temp" ]; then
	mkdir "${DIR}/temp"
fi

mongod --dbpath="$DIR"/data --port 27015 &> "${DIR}/temp/log.txt" &
