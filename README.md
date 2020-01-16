This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## NokoTime Entry Updater

A WebApp requiring the NokoTime v2 API Token.
The NokoTime website restricts you to entering one entry at a time for one day.
This WebApp will allow a user to update multiple entries at one time.

### Current structure is as follows:

server.js is the backend file.
You can run it with 
```
node server.js
```
It has been setup to listen on port 3010, for development purposes, from localhost

The Site itself, being a react app, can be run with
```
npm run start
```
This will run from local host 3000 by default, and a proxy for the local server listening on port 3010 has been setup

As stated, you will need your v2 API token, which you should be able to get from your Noko Account.
This updates only entries for the user of the account the token is from.
