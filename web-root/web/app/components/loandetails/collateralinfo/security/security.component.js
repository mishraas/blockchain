'use strict';

(function() {

    function securityController(loanService) {

        var $ctrl = this;
        $ctrl.showLoanFormSection = false;
        $ctrl.positionColumns = ["LOAN ID",
            "SECURITY NAME",
            "CUSIP",
            "QUANTITY",
            "PRICE",
            "MV",
            "COLLATERAL VALUE"
        ];

        $ctrl.$onInit = function() {
            if ($ctrl.prevPath === 'loanlisting') {
                $ctrl.showPositionFlag = true;
                $ctrl.securityDetails = {};
                $ctrl.securityDetails.columns = $ctrl.positionColumns;
                $ctrl.securityDetails.data = $ctrl.loan.collateralPositions;
                $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.securityDetails.data);
            }
        };

    }

    securityController.$inject = ['loanService'];

    var config = {
        bindings: {
            securityDetails: '<',
            loan: '=',
            showPositionFlag: '=',
            prevPath: '<'
        },
        templateUrl: 'loandetails/collateralinfo/security/security.html',
        controller: securityController
    };

    module.exports = angular.module('loandetails').component('security', config);


})();
