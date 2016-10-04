'use strict';

(function() {

    var loandetailsController = function(loanService, EntityMapper, Loan, $timeout, $rootScope, $anchorScroll, $location, $router, LoanStatus) {
        var $ctrl = this;
        $ctrl.closeOtherAccordian = $ctrl.openLoanInfoSection = $ctrl.disableDraftButton = $ctrl.disableConsentButton = true;
        $ctrl.openCollateralInfoSection = false;
        $ctrl.loan = new EntityMapper(Loan).toEntity({});
        $ctrl.successFlag = $ctrl.errorFlag = false;

        this.$routerOnActivate = function(next) {
           

            loanService.getUsesOfLoanProceeds().then(function(response) {
                $ctrl.useOfLoanProceeds = response.data['useOfLoanProceeds'];
                if (next.params.id) {
                    var loanId = next.params.id;
                    loanService.getLoanDetails(loanId).then(function(loanData) {
                        $ctrl.loan = loanData.data;
                        $rootScope.$broadcast('enableRateSection', { loanData: $ctrl.loan });
                        $ctrl.openCollateralInfoSection = true;
                    });
                }
            });

        };

        $ctrl.expandCollateralInfo = function() {
            $ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
        };

        $ctrl.saveLoan = function() {
            loanService.saveLoanData($ctrl.loan).then(function(response) {
                if (response.data.success) {
                    $location.hash('form-message');
                    $ctrl.successFlag = true;
                    $ctrl.loan.id = response.data.loanId;
                    $timeout(function() {
                        $ctrl.successFlag = false;
                    }, 5000);
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

        $ctrl.saveAndContinue = function() {
            var loanStatus = {
                id: 'pendingConsent',
                value: 'Pending For Constent'
            };
            var status = new EntityMapper(LoanStatus).toRaw(loanStatus);
            $ctrl.loan.status = status;
            loanService.saveLoanData($ctrl.loan).then(function(response) {
                if (response.data.success) {
                   $router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $ctrl.errorFlag = true;
                $location.hash('form-message');
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 3000);
            });
        };

        $ctrl.enableLoanSubmissionButton = function() {
            $ctrl.disableDraftButton = $ctrl.disableConsentButton = false;
        };

        $rootScope.$broadcast('navButton', { status: true });

    };

    loandetailsController.$inject = ['loanService', 'EntityMapper', 'Loan', '$timeout', '$rootScope',
        '$anchorScroll', '$location', '$router', 'LoanStatus'
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
