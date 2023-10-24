const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');

// Back-end (Node.js, Express.js)

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for your tasks
const TaskSchema = new mongoose.Schema({
  description: String,
  dueDate: Date,
  status: String,
  priority: Number,
  userId: String
});

// Create a model from the schema
const Task = mongoose.model('Task', TaskSchema);

// Configure Passport.js for GitHub authentication
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // In a real application, you'd look up the user in your database here
    return cb(null, profile);
  }
));

// Configure Express.js
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize users
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // In a real application, you'd look up the user in your database here
  done(null, { id: id });
});

// Define routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // User is logged in, display their tasks
    Task.find({ userId: req.user.id }, function(err, tasks) {
      if (err) return console.error(err);
      res.send('Your tasks: ' + JSON.stringify(tasks));
    });
  } else {
    // User is not logged in, show a link to the login page
    res.send('<a href="/auth/github">Log in with GitHub</a>');
  }
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
