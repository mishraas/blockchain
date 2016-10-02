'use strict';

(function() {

    var collateralInfoController = function(loanService, EntityMapper, CollateralAccount, CollateralPosition) {

        var $ctrl = this;
        $ctrl.loan.collateralValue = 0;
        $ctrl.showPositionFlag = false;
        $ctrl.securityDetails = {};
        $ctrl.showSecuritySection = function() {
            //TODO
            $ctrl.loan.collateralAccounts = new EntityMapper(CollateralAccount).toEntities(loanService.selectedAccountList);
            var collateralAccountIds = [];
            for (var index = 0, len = loanService.selectedAccountList.length; index < len; index++) {
                collateralAccountIds.push(loanService.selectedAccountList[index].id);
            }

            var params = {
                borrowerEmailId: $ctrl.loan.borrower.emailId,
                collateralAccountIds: collateralAccountIds
            };

            loanService.getAccountSecurities(params).then(function(response) {
                $ctrl.loan.collateralPositions = new EntityMapper(CollateralPosition).toEntities(response.data['securityDetails'].data);
                $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.loan.collateralPositions);
                $ctrl.securityDetails = response.data['securityDetails'];
                $ctrl.enableSecuritySection = $ctrl.showPositionFlag = true;
                $ctrl.enableFormSubmissionBtn();
            });
        };

        function loadAccountListSection(selectedCollateralAccounts, collateralAccountList) {
            angular.forEach(selectedCollateralAccounts, function(selectedAccount) {
                angular.forEach(collateralAccountList, function(account) {
                    if (selectedAccount.id === account.id) {
                        account.selected = true;
                    }
                });
            });
            return collateralAccountList;
        }

        //TODO: Life hooks
        this.$onInit = function() {
            loanService.getCollateralAccountList().then(function(response) {
                $ctrl.collateralAccountList = new EntityMapper(CollateralAccount).toEntities(response.data['collateralAccounts']);
                if ($ctrl.prevPath === 'loanlisting') {
                    $ctrl.collateralAccountList = loadAccountListSection($ctrl.loan.collateralAccounts,
                        $ctrl.collateralAccountList);
                }

                $ctrl.enableSecuritySection = false;

            });
        };
    };

    collateralInfoController.$inject = ['loanService', 'EntityMapper',
        'CollateralAccount', 'CollateralPosition'
    ];

    var collateralInfoConfig = {
        bindings: {
            loan: '=',
            saveLoan: '&',
            enableFormSubmissionBtn: '&',
            prevPath: '<'
        },
        templateUrl: 'loandetails/collateralinfo/collateralinfo.html',
        controller: collateralInfoController
    };

    angular.module('loandetails').component('collateralInfo',
        collateralInfoConfig);

})();
