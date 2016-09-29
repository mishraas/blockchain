'use strict';

(function() {

     var loanlistingController = function(loanService, EntityMapper, Loan, userService) {

        var $ctrl = this;        

        var user = userService.getLoggedInUser();

        loanService.getLoanList({usedId: user.emailId, userRole: user.roles[0].role}).then(function(response){

            $ctrl.loanList = new EntityMapper(Loan).toEntities(response.data.loanList);

        }, function(){});
    };

    loanlistingController.$inject = ['loanService', 'EntityMapper', 'Loan', 'userService'];


    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loanlisting/loanlisting.html',
        controller: loanlistingController,
        $canActivate: ['$nextInstruction', '$prevInstruction', 'userService', function($nextInstruction, $prevInstruction, userService) {
            if (userService.isAnonymous() === true) {
                window.location.pathname = '/login';
                return false;
            } else {
                return true;
            }
        }]
    };

    module.exports = angular.module('loanlisting')
        .component('loanListing', componentConfig);

})();
