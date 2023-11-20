#!/bin/sh
bundle=$1
zip=$2
jq -r .endoZipBase64 b.json| base64 -d > $2