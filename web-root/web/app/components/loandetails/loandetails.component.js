'use strict';

(function() {

    var loandetailsController = function(loanService, EntityMapper, Loan, $timeout, $anchorScroll, $location ,$router) {
        var $ctrl = this;
        $ctrl.closeOtherAccordian = true;
        $ctrl.openLoanInfoSection = true;
        $ctrl.openCollateralInfoSection = false;
        $ctrl.loan = new EntityMapper(Loan).toEntity({});
        $ctrl.successFlag = $ctrl.errorFlag = false;

        this.$routerOnActivate = function() {
            loanService.getUsesOfLoanProceeds().then(function(response) {
                $ctrl.useOfLoanProceeds = response.data['useOfLoanProceeds'];
            });

        };

        $ctrl.expandCollateralInfo = function() {
            $ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
        };

        $ctrl.saveLoan = function() {
            loanService.saveLoanData($ctrl.loan).then(function(response) {
                if (response.data.success) {
                    $ctrl.successFlag = true;
                    $ctrl.loan.id = response.data.loanId;
                    $location.hash('form-message');
                    $timeout(function() {
                        $ctrl.successFlag = false;
                    }, 5000);
                }
            }, function(err) {
                console.log(err);
                $ctrl.errorFlag = true;
                $location.hash('form-message');
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 5000);
            });
        };

         $ctrl.saveAndContinue = function() {
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
                }, 5000);
            });
        };

    };

    loandetailsController.$inject = ['loanService', 'EntityMapper', 'Loan', '$timeout', '$anchorScroll', '$location','$router'];

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
