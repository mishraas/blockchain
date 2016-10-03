'use strict';

(function() {



    angular.module('core.domain')
        .factory('Status', [function() {
            var Status = function(data) {
                if (data instanceof Object) {
                    this.statusId = data.statusId;
                    this.statusValue = data.statusValue;
                }
            };

            Status.prototype = {

            };
            return Status;
        }]);


})();