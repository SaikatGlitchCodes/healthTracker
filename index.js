const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");
require('dotenv').config();
const session = require('express-session');
const isAuthenticated = require('./app/middleware/auth/isAuthenticated')


//all global middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',  // your frontend URL
  credentials: true  // enable credentials (cookies, authorization headers)
}));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())

//Authentication methods
require('./app/middleware/auth/localStrategy');
require('./app/middleware/auth/githubStrategy');

passport.serializeUser((user, done) => {
    console.log('On serialize', user)
    done(null, user)
})

passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id)
    done(null, id)
})

app.get('/', (req, res) => {
    res.status(200).json({ message: 'app is healthy', data: true });
});

app.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: "Logic" })
})

// User routes
app.use('/user', require('./app/route/user'));

// Habit routes
app.use('/habit', isAuthenticated, require('./app/route/habit'));

app.get('/check-session', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Auth routes
app.post("/auth/local", passport.authenticate('local'), (req, res)=>{
    console.log('Local strategy');
    const data = req.user;
    res.json({message: "logged in using local strategy", data })
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        successRedirect: 'http://localhost:3000/dashboard',
        failureRedirect: 'http://localhost:3000/login'
    })
);

app.get('/logout', (req, res) => {
    console.log("logged Out")
    req.logout((err) => {
        if (err) { return next(err); }
        return res.status(200).json({ message: 'Successfully logout user' });
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});