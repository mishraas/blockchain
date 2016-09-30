'use strict';

(function() {

    function securityController() {

        var $ctrl = this;
        $ctrl.showLoanFormSection = false;
        $ctrl.loan.collateralValue=0;
        function calculateCollateralAmount(collateralPositions) {
            collateralPositions.forEach(function(position) {
                $ctrl.loan.collateralValue += Number.parseInt(position.collateralValue);
            });
        }

        this.$onInit = function() {
            $ctrl.showLoanFormSection = false;
            //$ctrl.accountDetails = $ctrl.securityDetails;
            //$ctrl.loanAmount = '$' + loanService.loanAmount;
            calculateCollateralAmount($ctrl.loan.collateralPositions);
        };

    }

    securityController.$inject = [];

    var config = {
        bindings: {
            securityDetails: '=',
            loan: '='
        },
        templateUrl: 'loandetails/collateralinfo/security/security.html',
        controller: securityController
    };

    module.exports = angular.module('loandetails').component('security', config);


})();
