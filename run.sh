#!/usr/bin/env bash
DB_HOST=mongo
DB_PORT=27017

# Wait for Mongo database to start
until timeout 1 bash -c "</dev/tcp/${DB_HOST}/${DB_PORT}"
do
	echo "Waiting for Mongo to start..."
	sleep 1
done

# Unit tests
npm test
echo "Waiting 10 seconds..."
sleep 10

# Debug mode
DEBUG=www_memegen:* npm run devstart
# normal start
#npm start
