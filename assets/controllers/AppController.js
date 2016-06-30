var Foodstrap;
(function (Foodstrap) {
    "use strict";
    var AppController = (function () {
        function AppController($rootScope) {
            this.$rootScope = $rootScope;
            var ctrl = this;
            $rootScope.aboutIsShown = false;
            $rootScope.showAbout = function () { return $rootScope.aboutIsShown = true; };
            $rootScope.hideAbout = function () { return $rootScope.aboutIsShown = false; };
        }
        AppController.$inject = ["$rootScope"];
        return AppController;
    })();
    Foodstrap.AppController = AppController;
})(Foodstrap || (Foodstrap = {}));
//# sourceMappingURL=AppController.js.map