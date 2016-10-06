'use strict';
var express = require('express');
var User = require('./models/User');
var jwt = require('jsonwebtoken');
var config = require('../config');

/* Load mock JSON data */
var usersList = require('./models/usersList');
var loanReasonsData = require("./models/useOfLoans"); 
var loanListData = require("./models/loanList");

var router = express.Router();
var app = express();


app.set('superSecret', config.secret);

function getLoanDetailsById(loanId){
    var loanList = loanListData.loanList;
    var loan = null;
    loanList.some(function(item){        
        if(loanId && item.id === loanId){
            loan = item;
            return true;
        }
    });
    return loan;
}

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
        usersList.some(function(item){        
            if(item.userName === reqUsername && item.password === reqPassword){
                isValidUser = true;
                authenticUser = item;
                return true; // break loop iteration
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
    var newLoanId;
    var request = (req.body ? req.body : null);
    
    function generateNewLoanId(){
         return (Math.floor(1000 + Math.random() * 9000));
    }

    function updateLoanDataWithNewLoan(){    
         newLoanId = "LN"+generateNewLoanId();
         var newLoan = {
            "id": newLoanId,
            "loanAmount": request.loanAmount,
            "useOfLoanProceeds": request.useOfLoanProceeds,
            "rateOfInterest": request.rateOfInterest,
            "libor": request.libor,
            "spread": request.spread,
            "custodian": request.custodian,
            "broker": request.broker,
             "collateralAccounts": request.collateralAccounts,
            "collateralPositions": request.collateralPositions,
            "borrower": request.borrower,
            "collateralValue": request.collateralValue,
            "status": "Pending Consent",
            "creditLimit": "creditLimit",
            "outstanding": "25000",
            "creditLineExcess": "creditLineExcess",
            "amountAvailableToBorrow": "14000",
            "marginCallAmount": "0",
            "marginCallDueDate": "NA",
            "marketValue": "marketValue",
            "lendableValue": "lendableValue",
            "excess": "excess",
            "deficit": "deficit",
            "lenderName": "lenderName",
            "lenderAddress": "street abc xyz"
        };

        loanListData.loanList.push(newLoan);    
    }

    function updateLoanDataWithExistingLoan(){     
        // todo
        
    }

    function checkForNewLoan(){
         if(request !== null){
            return (!request.id || request.id === null ? true : false);
         } else {
                res.json({
                success: false,
                message: 'Error form not saved.'
            });
         }
    }

    var isNewLoan = checkForNewLoan();
    isNewLoan === true ?  updateLoanDataWithNewLoan() : updateLoanDataWithExistingLoan();
    res.json({
        success: true,
        loanId :  newLoanId,
        message: 'form saved successfully'
    });
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
    var loan = getLoanDetailsById(req.params.loanId);
    res.send(loan);
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
