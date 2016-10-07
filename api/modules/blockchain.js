var usersList = require('./../models/usersList');
var userActions = require('./../models/userActions');
module.exports = function(loanListData) {
    return {
		authenticateUser: function(requestObj){
			var authenticUser;
		    var isValidUser = false;
		    var reqUsername = requestObj.userName;
		    var reqPassword = requestObj.password;
			if (!usersList) {
				return {
					success: false
				};
		    }
		    // match username and password
		    usersList.some(function(item){     
		        if(item.userName === reqUsername && item.password === reqPassword){
		            isValidUser = true;
		            authenticUser = item;
		            return true; // break loop iteration
		        }
		    });
		    return {
		    	isValid: isValidUser,
		    	authenticUser: authenticUser
		    };
		},
		getLoanDetailsById: function(loanId){
		    var loan = null;
		    loanListData.loanList.some(function(item){        
		        if(loanId && item.id === loanId){
		            loan = item;
		            return true;
		        }
		    });
		    return loan;
		},
		performUserAction: function(loanId, action){
			var isSuccess = false;
		    loanListData.loanList.some(function(item){        
		        if(loanId && item.id === loanId){
		        	if(action === userActions.lender){
		                item.status = 'approved';
		                isSuccess= true;
		            } else if(action === userActions.financialadvisor){
		            	 item.status = 'pendingAcknowledgement';
		                 isSuccess= true;
		            } else if(action === userActions.borrower){
		                 item.status = 'pendingApproval';
		                 isSuccess= true;
		            }
		            return true;
		        }
		    });
		   return isSuccess;
		},
		saveLoanData : function(req){
			var newLoanId;
		    var request = (req.body ? req.body : null);
		    var newLoan = {};
		    
		    function generateNewLoanId(){
		         return "LN"+(Math.floor(1000 + Math.random() * 9000));
		    }

		    function setNewLoandetails(loanId){
		    	newLoan.id = loanId,
	            newLoan.loanAmount = request.loanAmount,
	            newLoan.useOfLoanProceeds = request.useOfLoanProceeds,
	            newLoan.rateOfInterest = request.rateOfInterest,
	            newLoan.libor = request.libor,
	            newLoan.spread = request.spread,
	            newLoan.custodian = request.custodian,
	            newLoan.broker = request.broker,
	            newLoan.collateralAccounts = request.collateralAccounts,
	            newLoan.collateralPositions = request.collateralPositions,
	            newLoan.borrower = request.borrower,
	            newLoan.collateralValue = request.collateralValue,
	            newLoan.status = "pendingConsent",
	            newLoan.creditLimit = "creditLimit",
	            newLoan.outstanding = "25000",
	            newLoan.creditLineExcess = "creditLineExcess",
	            newLoan.amountAvailableToBorrow = "14000",
	            newLoan.marginCallAmount = "0",
	            newLoan.marginCallDueDate = "NA",
	            newLoan.marketValue = "marketValue",
	            newLoan.lendableValue = "lendableValue",
	            newLoan.excess = "excess",
	            newLoan.deficit = "deficit",
	            newLoan.lenderName = "lenderName",
	            newLoan.lenderAddress = "street abc xyz"
		    }

		    function updateLoanDataWithNewLoan(){ 
		    	newLoanId = generateNewLoanId();
		        setNewLoandetails(newLoanId)
		        loanListData.loanList.push(newLoan);
		        return {
			        success: true,
			        loanId : newLoanId,
			        message: 'form saved successfully'
			    };   
		    }

		    function updateLoanDataWithExistingLoan(loanId){       
		        loanListData.loanList.some(function(item){        
		            if(loanId && item.id === loanId){
		                item.loanAmount = request.loanAmount;
		                item.useOfLoanProceeds = request.useOfLoanProceeds;
		                item.rateOfInterest = request.rateOfInterest;
		                item.libor = request.libor;
		                item.spread = request.spread;
		                item.custodian = request.custodian;
		                item.broker = request.broker;
		                item.collateralAccounts = request.collateralAccounts;
		                item.collateralPositions = request.collateralPositions;
		                item.borrower = request.borrower;
		                item.collateralValue = request.collateralValue;
		                return true;
		            }
		        });
		        return {
			        success: true,
			        loanId : newLoanId,
			        message: 'form saved successfully'
			    }; 
		    }

		    function checkForNewLoan(){
		         if(request !== null){
		            return (!request.id || request.id === null ? true : false);
		         } else {
		                res.json({
		                success: false,
		                message: 'Error, New loan not saved.'
		            });
		         }
		    }

		    var isNewLoan = checkForNewLoan();
		    var result = (isNewLoan === true) ?  updateLoanDataWithNewLoan() : updateLoanDataWithExistingLoan(request.id);
		    return result;
		}
	};
};