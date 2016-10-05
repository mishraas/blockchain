'use strict';

(function() {

    function securityController(loanService,$rootScope) {

        var $ctrl = this;
        $ctrl.showLoanFormSection = false;
        $ctrl.loanApprovalFlag = false;
        $ctrl.positionColumns = ["LOAN ID",
            "SECURITY NAME",
            "CUSIP",
            "QUANTITY",
            "PRICE",
            "MV",
            "COLLATERAL VALUE"
        ];

        $ctrl.$onInit = function() {
            $ctrl.loanApprovalFlag = $ctrl.loan.collateralValue >= (0.8*$ctrl.loan.loanAmount);
            if ($ctrl.loan.id) {
                $ctrl.showPositionFlag = true;
                $ctrl.securityDetails = {};
                $ctrl.securityDetails.columns = $ctrl.positionColumns;
                $ctrl.securityDetails.data = $ctrl.loan.collateralPositions;
                $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.securityDetails.data);
                
            }
        };

        $rootScope.$on('showApprovalButton',function(evt,collateralValue){
                            $ctrl.loanApprovalFlag = collateralValue.value >= (0.8*$ctrl.loan.loanAmount);
                
        });

    }

    securityController.$inject = ['loanService','$rootScope'];

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
