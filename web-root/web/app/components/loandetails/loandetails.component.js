'use strict';

(function() {

    var loandetailsController = function(loanService) {
        var $ctrl = this;
        $ctrl.closeOtherAccordian = true;
        $ctrl.openLoanInfoSection = true;
        $ctrl.openCollateralInfoSection = false;

        $ctrl.expandCollateralInfo = function() {
            $ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
        };

        $ctrl.init = function() {
            loanService.getUsesOfLoanProceeds().then(function(response) {
                $ctrl.usesOfLoanProceeds = response.data['useOfLoanProceeds'];
            });

        };
        $ctrl.init();

    };

    loandetailsController.$inject = ['loanService'];

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
            function($nextInstruction, $prevInstruction, userService, $router) {
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
