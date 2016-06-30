var Foodstrap;
(function (Foodstrap) {
    "use strict";
    var CompleteController = (function () {
        function CompleteController() {
        }
        CompleteController.$inject = [
            "$scope",
            "$routeParams",
            "$location",
            "$interval",
            "$timeout"
        ];
        return CompleteController;
    }());
    Foodstrap.CompleteController = CompleteController;
})(Foodstrap || (Foodstrap = {}));
