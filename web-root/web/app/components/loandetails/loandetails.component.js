'use strict';

(function() {

	var loandetailsController = function(loanService, EntityMapper, Loan) {
		var $ctrl = this;
		$ctrl.closeOtherAccordian = true;
		$ctrl.openLoanInfoSection = true;
		$ctrl.openCollateralInfoSection = false;
		$ctrl.loan = new EntityMapper(Loan).toEntity({});

		this.$routerOnActivate = function() {
			loanService.getUsesOfLoanProceeds().then(function(response) {
				$ctrl.useOfLoanProceeds = response.data['useOfLoanProceeds'];
			});

		};

		$ctrl.expandCollateralInfo = function() {
			$ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
		};

		$ctrl.saveLoan = function() {
			console.log($ctrl.loan);
		};

	};

	loandetailsController.$inject = [ 'loanService', 'EntityMapper', 'Loan' ];

	var componentConfig = {
		// isolated scope binding
		bindings : {
			loanInfo : '<'
		},
		templateUrl : 'loandetails/loandetails.html',
		controller : loandetailsController,
		$canActivate : [
				'$nextInstruction',
				'$prevInstruction',
				'userService',
				'$router',
				function($nextInstruction, $prevInstruction, userService,
						$router) {
					if (userService.isAnonymous() === true) {
						$router.navigate([ 'Login' ]);
						return false;
					} else {
						return true;
					}
				} ]
	};

	module.exports = angular.module('loandetails').component('loanDetails',
			componentConfig);

})();
