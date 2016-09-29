'use strict';

(function() {

	var collateralInfoController = function(loanService, EntityMapper, CollateralAccount, CollateralPosition) {

		var $ctrl = this;

		$ctrl.collateralAccountList = [];
		$ctrl.showSecuritySection = function() {
			//TODO
			$ctrl.loan.collateralAccounts = new EntityMapper(CollateralAccount).toEntities(loanService.selectedAccountList);
			var collateralAccountIds = [];
			for (var index = 0, len = loanService.selectedAccountList.length; index < len; index++) {
				collateralAccountIds.push(loanService.selectedAccountList[index].id);
			}

			var params = {
				borrowerEmailId : $ctrl.loan.borrower.emailId,
				collateralAccountIds : collateralAccountIds
			};

			loanService.getAccountSecurities(params).then(function(response) {
				$ctrl.loan.collateralPositions = new EntityMapper(CollateralPosition).toEntities(response.data['securityDetails'].data);
				$ctrl.securityDetails = response.data['securityDetails'];
				$ctrl.enableSecuritySection = true;
			});
		};

		//TODO: Life hooks
		$ctrl.init = function() {
			loanService.getCollateralAccountList().then(function(response) {
				$ctrl.collateralAccountList = new EntityMapper(CollateralAccount).toEntities(response.data['collateralAccounts']);
				$ctrl.enableSecuritySection = false;
				$ctrl.securityDetails = {};
			});
		};
		$ctrl.init();
	};

	collateralInfoController.$inject = [ 'loanService', 'EntityMapper',
			'CollateralAccount', 'CollateralPosition' ];

	var collateralInfoConfig = {
		bindings : {
			'loan' : '=',
			'saveLoan' : '&'
		},
		templateUrl : 'loandetails/collateralinfo/collateralinfo.html',
		controller : collateralInfoController
	};

	angular.module('loandetails').component('collateralInfo',
			collateralInfoConfig);

})();
