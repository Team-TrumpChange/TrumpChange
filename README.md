


## Team

  - __Product Owner__: JP Angelle
  - __Scrum Master__: Amy Glover
  - __Development Team Members__: Manik Sewak


# custom_starter
This is a custom boilerplate for react and node with express

First run npm install
make sure you have webpack installed (npm install -g webpack)
then run these two commands in order:
npm run react-dev 
wait for it to compile 
npm run server-dev

start coding



---index.jsx

Most of the states on this component are for input field values and 
to control different modals being opened or closed.

To start off, it grabs Trump's tweets from the db and displays them on the first column and then does that on a setInterval every 30 seconds.

It does the same with getStats()  it gets some basic stats of the data in the db and displays in the middle column, which is represented by chart.jsx, and then continues to do that every 30 seconds.

funtion submitSignup is handling the signup inputs for when you click the signup button. It checks all edge cases ...
    (all fields are filled, passwords match, and limit is a #)
then it sends the info to the backend.
It handles edge cases for if the server sends back a message saying
that username of email already exists in db.

function submitlogin handles the login modal. Pretty self-explanatory.

Function changeUserInfo is basically to change any info a user gave during signup. Only needed for when a user is logged in.

Function getUserProfile is for once the user logs in, it grabs their data from the db to display in the third column.

Function getStats gets basic stats of the data in the db and sends it down to chart.jsx.

Function onToken takes the info entered into the stripeAPI credit card input form and creates a token. Then sends the important info from that token to the backend which eventually gets saved into the db and stripe dashboard.

The first 80 or so lines are for basic stuff for styling

'const logIn' is the layout for the input fields and buttons for 
the login modal

'const signUp' is the layout for the input fields and buttons for 
the signup modal

'const update' is for the layout of the update field which is only accessible when a user is logged in.

'const stripe' is for the stripe form

'const faq' is for the layout for the faq modal for when you click the ? button at the top

'const ForgotPassword' is fort the layout for the forgot password modal which only appears if you click 'forgot password' in the login field.

In the return
Dialogs refers to the modals that would popup if you clicked on their respective buttons.