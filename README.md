# ToDo List App
Simple ToDo List App with limited functionality created by following tutorials.

The app uses EJS, MongoDB and Heroku for its functionality. It was an exercise in NodeJS, Express, EJS and MongoDB databases. This is meant as a stepping stone to creating a personal blog website.

## Live site

`https://leona-todolist-v2.herokuapp.com/`

- You can add new ToDo items by type in the text box and hitting the `+` button.

- You can delete items by clicking the checkbox.

- You can also generate new lists by adding a new route after the url. Example:

`https://leona-todolist-v2.herokuapp.com/work`

- This will generate a new work list if it does not exist. If it does, then it will access the list for the given route.

## How to use locally

To run, clone repo and ensure you have Nodemon installed.

`npm install`

`nodemon app.js`

Go to `http://localhost:3000`