#!/bin/bash

# import from which dir, 2019xxyy
IMPDIR=$1
if [ -z $1 ]; then
	echo "Usage: $0 YYYYmmdd"
	exit 1;
fi

echo "Restore games data from$ IMPDIR"
mongorestore --db dbname $IMPDIR/dbname

