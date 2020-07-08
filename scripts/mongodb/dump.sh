#!/bin/bash

OUTDIR=`date +'%Y%m%d'`
mkdir $OUTDIR
mongodump -d dbname -o $OUTDIR

echo "Dumped database db to $OUTDIR"
