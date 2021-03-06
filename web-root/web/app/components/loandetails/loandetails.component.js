'use strict';

(function() {

    var loandetailsController = function(loanService, EntityMapper, Loan, $timeout, $rootScope, $anchorScroll, $location, $router, LoanStatus, userService) {
        var $ctrl = this;
        $ctrl.closeOtherAccordian = $ctrl.openLoanInfoSection = $ctrl.disableDraftButton = $ctrl.disableConsentButton = $ctrl.disableCollateralInfoSection = true;
        $ctrl.openCollateralInfoSection = false;
        $ctrl.loan = new EntityMapper(Loan).toEntity({});
        $ctrl.successFlag = $ctrl.errorFlag = false;
        $ctrl.loanStatus = false;
        var user = userService.getLoggedInUser();
        $ctrl.loanStates = loanService.getLoanStates();
        $ctrl.UserRoles = userService.getUserRoles();
        $ctrl.userActions = userService.getUserActions();

        $ctrl.currentUserRole = user && (user.roles instanceof Array) && user.roles[0].role;

        function enableControls(userRole, loanStatus) {
            switch(userRole) {
                case $ctrl.UserRoles.financialAdvisor:
                    if (loanStatus === $ctrl.loanStates.pendingConsent) {
                        $ctrl.isLoanInfoSaveAndContinue = true; 
                        $ctrl.isSaveDraft = true;
                        $ctrl.isSendConsent = true; 
                        $ctrl.isCalculateCollateral = true; 
                        $ctrl.isInputControls = false; 
                    } else {
                        $ctrl.isLoanInfoSaveAndContinue = false;    
                        $ctrl.isSaveDraft = false;
                        $ctrl.isSendConsent = false; 
                        $ctrl.isCalculateCollateral = false;
                        $ctrl.isInputControls = true;
                    }
                    $ctrl.isAcknowledge = true;
                    $ctrl.isApprove = false;
                    break;
                case $ctrl.UserRoles.borrower:
                    if (loanStatus === $ctrl.loanStates.pendingAcknowledgement) {
                        $ctrl.isAcknowledge = false;                        
                         
                    } else {
                        $ctrl.isAcknowledge = true;                        
                    }

                    $ctrl.isLoanInfoSaveAndContinue = false; 
                    $ctrl.isSaveDraft = false;
                    $ctrl.isSendConsent = false; 
                    $ctrl.isCalculateCollateral = false; 
                    $ctrl.isApprove = false;
                    $ctrl.isInputControls = true;
                    break;
                case $ctrl.UserRoles.lender:
                    if (loanStatus === $ctrl.loanStates.pendingApproval) {
                        $ctrl.isApprove = true;                        
                         
                    } else {
                        $ctrl.isApprove = false;
                    }

                    $ctrl.isLoanInfoSaveAndContinue = false; 
                    $ctrl.isSaveDraft = false;
                    $ctrl.isSendConsent = false; 
                    $ctrl.isCalculateCollateral = false; 
                    $ctrl.isAcknowledge = true;
                    $ctrl.isInputControls = true;
                    break;
            }
        }   

        this.$routerOnActivate = function(next) {
            loanService.getUsesOfLoanProceeds().then(function(response) {
                $ctrl.useOfLoanProceeds = response.data['useOfLoanProceeds'];
                var loanId = next && next.params && next.params.id;

                if (loanId) {      
                    $ctrl.disableCollateralInfoSection = false;              
                    loanService.getLoanDetails(loanId).then(function(response) {
                        $ctrl.loan = response.data;
                        enableControls($ctrl.currentUserRole, $ctrl.loan.status);
                        $rootScope.$broadcast('enableRateSection', { loanData: $ctrl.loan });
                        $ctrl.openCollateralInfoSection = true;
                    });
                } else {
                    enableControls($ctrl.currentUserRole, $ctrl.loanStates.pendingConsent);
                }
            });
        };

        $ctrl.expandCollateralInfo = function() {
            $ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
            $ctrl.disableCollateralInfoSection = false;
        };
        $ctrl.approveLoan = function(){
            var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.lender
            };

            loanService.approveLoanData(reqObj).then(function(response) {
                if (response.data.success && response.data.success === true) {
                   $router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };
        $ctrl.acknowledgeLoan = function(){
             var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.borrower
            };
           
            loanService.acknowledgeLoanData(reqObj).then(function(response) {
                if (response.data.success && response.data.success === true) {
                  $router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };

        function setMockValuesForNewLoan(){
            // used for setting the mock values in the saveloan request object
            // tobe removed in future
            $ctrl.loan.status = "pendingConsent";
            $ctrl.loan.creditLimit = "creditLimit";
            $ctrl.loan.outstanding = "21000";
            $ctrl.loan.creditLineExcess = "creditLineExcess";
            $ctrl.loan.amountAvailableToBorrow = "10000";
            $ctrl.loan.marginCallAmount = "0";
            $ctrl.loan.marginCallDueDate = "NA";
            $ctrl.loan.marketValue = "marketValue";
            $ctrl.loan.lendableValue = "lendableValue";
            $ctrl.loan.excess = "excess";
            $ctrl.loan.deficit = "deficit";
            $ctrl.loan.lenderName = "lenderName";
            $ctrl.loan.lenderAddress = "lenderAddress";
        }

        $ctrl.saveLoan = function() {
            setMockValuesForNewLoan();
            loanService.saveLoanData($ctrl.loan).then(function(response) {
                if (response.data.success) {
                    $location.hash('form-message');
                    $ctrl.successFlag = true;
                    $ctrl.loan.id = response.data.loanId;
                    $timeout(function() {
                        $ctrl.successFlag = false;
                    }, 10000);
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 5000);
            });
        };

        $ctrl.sendConsent = function() {
            var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.financialAdvisor
            };
            loanService.sendConsent(reqObj).then(function(response) {
               if (response.data.success && response.data.success === true) {
                  $router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $ctrl.errorFlag = true;
                $location.hash('form-message');
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };

        $ctrl.enableLoanSubmissionButton = function() {
            $ctrl.disableDraftButton = $ctrl.disableConsentButton = false;
        };

        $rootScope.$broadcast('navButton', { status: true });

    };

    loandetailsController.$inject = ['loanService', 'EntityMapper', 'Loan', '$timeout', '$rootScope',
        '$anchorScroll', '$location', '$router', 'LoanStatus', 'userService'
    ];

    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loandetails/loandetails.html',
        controller: loandetailsController,        
        $canActivate: [
            '$nextInstruction',
            '$prevInstruction',
            'userService',
            '$router',
            function($nextInstruction, $prevInstruction, userService,
                $router) {
                if (userService.isAnonymous() === true) {
                    $router.navigate(['Login']);
                    return false;
                } else {
                    return true;
                }
            }
        ]
    };

    module.exports = angular.module('loandetails').component('loanDetails',
        componentConfig);

})();
