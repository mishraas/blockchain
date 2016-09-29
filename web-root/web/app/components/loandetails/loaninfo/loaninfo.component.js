"use strict";

(function() {

    var loanInfoController = function(loanService) {

        var $ctrl = this;
        $ctrl.enableRateSection = function() {
            loanService.getCurrentRate().then(function(response) {
                $ctrl.currentRate = response.data;
                $ctrl.showRateSection = !$ctrl.showRateSection;
            });
        };

        $ctrl.onLoanInfoSave = function(form) {
            if (form.$valid) {
                //TODO: call service API
                saveLoanInfoData();
                loanService.loanAmount = $ctrl.user.loanAmount;
                $ctrl.openCollateralAccordian();
            }
        };

        function saveLoanInfoData() {

            /*var loanInfoData = {
                firstName: $ctrl.user.firstName,
                middeleInitial: $ctrl.user.middleName,
                lastName: $ctrl.user.lastName,
                emailId: $ctrl.user.email,
                mobileNumber: $ctrl.user.mobilenumber,
                loanAmount: $ctrl.user.loanAmount,
                useofLoan: $ctrl.user.selectedReason.Reason
            };*/
            //TODO -- code for posting this data to backend

        }

        $ctrl.showRateSection = false;

    };

    loanInfoController.$inject = ['loanService'];

    var loanInfoConfig = {
        bindings: {
            usesOfLoanProceeds: '=',
            openCollateralAccordian: '&'
        },
        templateUrl: 'loandetails/loaninfo/loaninfo.html',
        controller: loanInfoController
    };

    angular.module('loandetails').component('loanInfo', loanInfoConfig);


})();
