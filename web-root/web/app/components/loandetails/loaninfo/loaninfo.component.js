"use strict";

(function() {

        var loanInfoController = function(loanService, EntityMapper, Person) {

            var $ctrl = this;
            $ctrl.loanAmountRegExp = /^[0-9]*\.?[0-9]+$/;

            $ctrl.enableRateSection = function(validAmtFlag){
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

                $ctrl.onLoanInfoSave = function(form) {
                    if (form.$valid) {

                        saveLoanInfoData();
                        var borrowerInfo = new EntityMapper(Person).toEntity($ctrl.user);
                        $ctrl.loanInfo.borrower = borrowerInfo;
                        $ctrl.loanInfo.useOfLoanProceeds = $ctrl.user.usesOfLoanProceeds.id;
                        $ctrl.loanInfo.loanAmount = $ctrl.user.loanAmount;
                        loanService.loanAmount = $ctrl.user.loanAmount;
                        loanService.getCollateralAccountList().then(function() {
                            $ctrl.openCollateralAccordian();
                        });
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

            loanInfoController.$inject = ['loanService', 'EntityMapper', 'Person'];

            var loanInfoConfig = {
                bindings: {
                    usesOfLoanProceeds: '=',
                    openCollateralAccordian: '&',
                    loanInfo: '='
                },
                templateUrl: 'loandetails/loaninfo/loaninfo.html',
                controller: loanInfoController
            };

            angular.module('loandetails').component('loanInfo', loanInfoConfig);

        })();
