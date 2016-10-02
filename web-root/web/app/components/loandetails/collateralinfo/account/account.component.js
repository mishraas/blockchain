'use strict';

(function() {

    function accountController(loanService) {
        var $ctrl = this;
        var selectedAccountList = [];
        $ctrl.noAccountSelectedMessage = false;

        $ctrl.enableSecuritySection = function() {
            selectedAccountList = getSelectedCollateralAccounts($ctrl.collateralAccountList);
            if (selectedAccountList.length) {
                loanService.selectedAccountList = selectedAccountList;
                $ctrl.securitySectionEnable();
            } else {
                $ctrl.noAccountSelectedMessage = true;
            }
        };

        function getSelectedCollateralAccounts(accountList) {
            var selectedAccounts = accountList.filter(function(account) {
                return account.selected === true;
            });
            return selectedAccounts;
        }

    }

    accountController.$inject = ['loanService'];

    var config = {
        bindings: {
            collateralAccountList: '=',
            selectedAccountList: '=',
            loan: '=',
            securitySectionEnable: '&',
            prevPath: '<'
        },
        templateUrl: 'loandetails/collateralinfo/account/account.html',
        controller: accountController
    };

    module.exports = angular.module('loandetails').component('account', config);

})();
