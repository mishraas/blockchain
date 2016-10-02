"use strict";

(function() {

    var loanInfoController = function(loanService, EntityMapper, Person) {

        var $ctrl = this;
        $ctrl.loanAmountRegExp = /^[0-9]*\.?[0-9]+$/;

        $ctrl.enableRateSection = function(validAmtFlag) {
            if (validAmtFlag) {
                loanService.getCurrentRate().then(function(rateInfo) {
                    $ctrl.rateOfInterest = $ctrl.loanInfo.rateOfInterest = rateInfo.data.rateOfInterest;
                    $ctrl.liber = $ctrl.loanInfo.liber = rateInfo.data.libor;
                    $ctrl.spread = $ctrl.loanInfo.spread = rateInfo.data.spread;
                    $ctrl.showRateSection = true;
                }, function() {
                    $ctrl.showRateSection = false;
                });
            }

        };

        $ctrl.onLoanInfoSave = function(form , loanInfo) {
            if (form.$valid) {
                var borrowerInfo = new EntityMapper(Person).toEntity(loanInfo.borrower);
                $ctrl.loanInfo.borrower = borrowerInfo;
                $ctrl.loanInfo.useOfLoanProceeds = loanInfo.useOfLoanProceeds;
                $ctrl.loanInfo.loanAmount = loanInfo.loanAmount;
                loanService.loanAmount = loanInfo.loanAmount;
                loanService.getCollateralAccountList().then(function() {
                    $ctrl.openCollateralAccordian();
                });
            }
        };

        $ctrl.showRateSection = false;

    };

    loanInfoController.$inject = ['loanService', 'EntityMapper', 'Person'];

    var loanInfoConfig = {
        bindings: {
            useOfLoanProceeds: '=',
            openCollateralAccordian: '&',
            loanInfo: '='
        },
        templateUrl: 'loandetails/loaninfo/loaninfo.html',
        controller: loanInfoController
    };

    angular.module('loandetails').component('loanInfo', loanInfoConfig);

})();
