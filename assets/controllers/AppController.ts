module Foodstrap {
    "use strict";

    export class AppController {

        static $inject = ["$rootScope"];

        constructor(private $rootScope: IRootScope) {
            var ctrl = this;

            $rootScope.aboutIsShown = false;
            $rootScope.showAbout = () => $rootScope.aboutIsShown = true;
            $rootScope.hideAbout = () => $rootScope.aboutIsShown = false;
        }


    }
}