# VotingApp
###### Features this app supports
1. User/Admin signup via api endpoints only
2. User/Admin login/logout via UI
3. Casting vote after logging in via UI (The app state allows a user to vote multiple times)
4. Listing the votes per candidate for admin only
5. Only users are allowed to vote not admin

## API Endpoints and usage
```
/users POST - for adding user
Reqest body should have { email , password, type}, type can be either admin or user
Response has generated _id,email
```
```
/users/login POST - for authenticating
Reqest body should have { email , password }
Response has generated _id,email,token
```
```
/candidates/ POST - for adding candidates
Reqest body should have { email , name, handle }
Headers should have authorization key as the token obtained on successfull login for admin 
Response has generated _id,email,handle,votesInFavor
```
```
/candidates/:id PUT - for adding vote
Headers should have authorization key as the token obtained on successfull login for user 
Response has generated _id,email,handle,votesInFavor
```
```
/candidates GET - for getting vote count for all candidates
Headers should have authorization key as the token obtained on successfull login for user or admin
Response has generated is array of objects having {_id,email,handle,votesInFavor(only for admin)}
```
Steps to install the dependencies
> npm install

Steps to run the application
> npm start

The application runs on port 3500