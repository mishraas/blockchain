'use strict';
var express = require('express');
var User = require('./models/User');
var jwt = require('jsonwebtoken');
var config = require('../config');

/* Load mock JSON data */
var loanReasonsData = require('./models/useOfLoans'); 
var loanListData = require('./models/loanList');

var blockchain = require('./modules/blockchain.js')(loanListData);
var router = express.Router();
var app = express();

app.set('superSecret', config.secret);

// route to authenticate a user on login (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
    var result = blockchain.authenticateUser(req.body);
    if (result && (result.success === false)) {
        res.json({success: false, message: 'Server error'});
    } else{  
        if (!result.isValid) {
            res.json({ success: false, message: 'Authentication failed. Invalid username, password.' });
        } else {
            // if user is found and password is right
            // create a token
            var tokenExpiry = 1440;
            var token = jwt.sign(result.authenticUser, app.get('superSecret'), {
                expiresIn: tokenExpiry // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Authenticated Successfully',
                token: token,
                tokenExpiry: tokenExpiry,
                userName: result.authenticUser.userName,
                firstName: result.authenticUser.firstName,
                lastName: result.authenticUser.lastName,
                emailId: result.authenticUser.emailId,
                roles: result.authenticUser.roles
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
    var result = blockchain.saveLoanData(req);
    res.json(result);
});

router.get('/getUsesOfLoanProceeds', function(req, res) {
    res.send(loanReasonsData);
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
    res.send(loanListData);
});

router.get('/getLoanDetails/:loanId', function(req, res) {
    var loan = blockchain.getLoanDetailsById(req.params.loanId);
    res.send(loan);
});

router.post('/approveLoanData', function(req, res) {
    var resp = blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
});

router.post('/acknowledgeLoanData', function(req, res) {
    var resp =  blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
});

router.post('/sendConsent', function(req, res) {
    var resp =  blockchain.performUserAction(req.body.loanId, req.body.action);
    res.send({ success: resp });
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
