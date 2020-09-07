This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## NokoTime Entry Updater

A WebApp requiring the NokoTime v2 API Token.
The NokoTime website restricts you to entering one entry at a time for one day.
This WebApp will allow a user to create multiple entries at one time.

A view has also been added to allow for seeing current entries for, today, tomorrow, yesterday, last week, and current week. Entries can also be deleted through this view.

This can easily be expanded upon to allow for editing.

> Note: Noko appears to restrict duplicate entries, even when done separately. However, if you create an entry via their website, and then use this, it'll permit the duplicate.

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

> Note: As stated, you will need your v2 API token, which you should be able to get from your Noko Account. This updates only entries for the user of the account the token is from.

server.js has minimal setup for session caching of entry data, the default setup with express-session

### Integration Test in place:
A test can be run, with npm test, that will check functionality for entry submission, and entry viewing


![noko_1](https://user-images.githubusercontent.com/8482594/92403987-9298c180-f100-11ea-84a5-7d155be4e242.gif)

![noko_2](https://user-images.githubusercontent.com/8482594/92404040-aba17280-f100-11ea-9cf2-adf1a89d0111.gif)
