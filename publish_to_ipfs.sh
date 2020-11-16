#!/bin/bash

# based on: https://dweb-primer.ipfs.io/publishing-changes/generate-keypair

CONTENT_PATH=$1
PIN_TO_PINATA=$2
IPNS_KEY=$3

if [ -z "$CONTENT_PATH" ]; then
	echo "path is empty!" 
	exit 1
fi

if [ -f "./current_cid" ]; then
	OLD_CID=$(cat ./current_cid)
fi


CID=$(ipfs add --recursive --quiet --pin=true "$CONTENT_PATH" | tail -n 1)
if [ "$CID" = "$OLD_CID" ]; then
	echo "Old and new CID's are the same!"
	exit
fi
echo "Added content with CID: $CID"


# publish to IPNS 
if [ -n "$IPNS_KEY" ]; then
	echo "Adding content to IPNS key: $IPNS_KEY"
	ipfs name publish --key="$IPNS_KEY"  "$CID"
fi

if [ -n "$OLD_CID" ]; then
	echo "Removing old content with CID: $OLD_CID"
	ipfs pin rm --recursive=true "$OLD_CID"
	ipfs repo gc --quiet
fi

echo -n "$CID" > ./current_cid

if [ "$PIN_TO_PINATA" = "true" ]; then
	echo "Pin data to pinata!"
	node $(pwd)/pin_to_pinata.js $CID $OLD_CID
fi	

