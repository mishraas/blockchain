'use strict';
var express = require('express');
var User = require('./models/User');
var jwt = require('jsonwebtoken');
var config = require('../config');
var usersList = require('./models/usersList');
var router = express.Router();
var app = express();

app.set('superSecret', config.secret);

// route to authenticate a user on login (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
    var authenticUser;

    /* compares the mocked username and password with those provided by user from login screen */
    function authenticateUser(requestObj){
        // flag to confirm user validity
        var isValidUser = false;
        var reqUsername = requestObj.userName;
        var reqPassword = requestObj.password;
        // match username and password
        usersList.forEach(function(item){
            console.log("item----1");
            console.log(item);            
            if(item.userName === reqUsername && item.password === reqPassword){
                isValidUser = true;
                authenticUser = item;
                return false; // break loop iteration
            }
        });
        return isValidUser;
    }
    
    if (!usersList) {
        res.json({ success: false, message: 'Server error.' });
    } else if (usersList) { 
        var isValid = authenticateUser(req.body);
        if (!isValid) {
            res.json({ success: false, message: 'Authentication failed. Invalid username, password.' });
        } else {
            // if user is found and password is right
            // create a token
            var tokenExpiry = 1440;
            var token = jwt.sign(authenticUser, app.get('superSecret'), {
                expiresIn: tokenExpiry // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Authenticated Successfully',
                token: token,
                tokenExpiry: tokenExpiry,
                userName: authenticUser.userName,
                firstName: authenticUser.firstName,
                lastName: authenticUser.lastName,
                emailId: authenticUser.emailId,
                roles: authenticUser.roles
            });
        }
    }
});

// route middleware to verify a token
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

// define the API route
router.get('/', function(req, res) {
    res.send('API is at /api/* ');
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/logout', function(req, res) {
    res.json({
        success: true,
        message: 'logged out successfully'
    });
});

router.post('/saveLoanData', function(req, res) {
    res.json({
        success: true,
        loanId : 'LN0011',
        message: 'form saved successfully'
    });
});

router.get('/getUsesOfLoanProceeds', function(req, res) {
    res.send(require("./models/useOfLoans"));
});
router.get('/getCurrentRate', function(req, res) {
    res.send(require("./models/currentRate"));
});

router.get('/getCollateralAccountList', function(req, res) {
    res.send(require("./models/collateralAccountList"));
});

router.post('/getAccountSecurities', function(req, res) {
    res.send(require("./models/collateralaccountsecuritydetails"));
});

router.get('/getLoanList', function(req, res) {
    res.send(require("./models/loanList"));
});

router.get('/getLoanDetails/LN0011', function(req, res) {
    res.send(require("./models/loan/LN0011"));
});

////************* Delete it after use
router.get('/setup', function(req, res) {
    // create a sample user
    var nick = new User({
        userName: 'sunil',
        password: 'Default123#',
        emailId: 'sunil@gmail.com',
        firstName: 'Sunil',
        lastName: 'Kumar',
        roles: ['admin', 'fa']
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

////*************

module.exports = router;
