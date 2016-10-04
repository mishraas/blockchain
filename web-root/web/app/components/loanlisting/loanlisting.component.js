'use strict';

(function() {

    var loanlistingController = function(loanService, EntityMapper, Loan, userService, $router) {

        var $ctrl = this;

        var user = userService.getLoggedInUser();

        loanService.getLoanList({ usedId: user.emailId, userRole: user.roles[0].role }).then(function(response) {

            $ctrl.loanList = new EntityMapper(Loan).toEntities(response.data.loanList);

        }, function() {});

        $ctrl.navigateToLoanDetails = function(loanId) {
            $router.navigate(['LoadLoanDetails', { id: loanId }]);
        };
    };

    loanlistingController.$inject = ['loanService', 'EntityMapper', 'Loan', 'userService', '$router'];


    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loanlisting/loanlisting.html',
        controller: loanlistingController,
        $canActivate: [
            '$nextInstruction',
            '$prevInstruction',
            'userService',
            '$router',
            function($nextInstruction, $prevInstruction, userService,
                $router) {
                if (userService.isAnonymous() === true) {
                    $router.navigate(['Login']);
                    return false;
                } else {
                    return true;
                }
            }
        ]
    };

    module.exports = angular.module('loanlisting')
        .component('loanListing', componentConfig);

})();
