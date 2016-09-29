'use strict';

(function() {

    function securityController() {

        var $ctrl = this;
        $ctrl.showLoanFormSection = false;
        $ctrl.loan.collateralValue=0;
        function calculateCollateralAmount(securityDetails) {
            securityDetails.forEach(function(security) {
                $ctrl.loan.collateralValue += Number.parseInt(security[security.length - 1]);
            });
        }

        this.$onInit = function() {
            $ctrl.showLoanFormSection = false;
            //$ctrl.accountDetails = $ctrl.securityDetails;
            //$ctrl.loanAmount = '$' + loanService.loanAmount;
            calculateCollateralAmount($ctrl.securityDetails.data);
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
