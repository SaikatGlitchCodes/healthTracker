const express = require('express');
const Router = express.Router();
const passport = require("passport");

Router.post("/local", passport.authenticate('local'), (req, res)=>{
    console.log('Local strategy');
    const data = req.user;
    res.json({message: "logged in using local strategy", data })
});

Router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

Router.get('/github/callback',
    passport.authenticate('github', {
        successRedirect: 'http://localhost:3000/dashboard',
        failureRedirect: 'http://localhost:3000/login'
    })
);

module.exports = Router;