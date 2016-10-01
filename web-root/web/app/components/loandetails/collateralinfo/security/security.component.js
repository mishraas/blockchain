'use strict';

(function() {

    function securityController() {

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

        this.$onInit = function() {

        };

    }

    securityController.$inject = [];

    var config = {
        bindings: {
            securityDetails: '=',
            loan: '=',
            showPositionFlag : '='
        },
        templateUrl: 'loandetails/collateralinfo/security/security.html',
        controller: securityController
    };

    module.exports = angular.module('loandetails').component('security', config);


})();
