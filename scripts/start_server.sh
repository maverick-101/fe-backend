#!/bin/bash
#export NODE_ENV=production
cd /home/ubuntu/saadiTrip-api
pm2 start app.js --name="web"
