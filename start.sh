#!/bin/bash

pushd /usr/local/nginx/sbin
sudo ./nginx
popd

pushd ~/elasticsearch-1.0.0/bin
nohup ./elasticsearch &
popd

echo "Done."
