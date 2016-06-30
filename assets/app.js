var Foodstrap;
(function (Foodstrap) {
    "use strict";
    angular
        .module("app", ["ngRoute", "ngTouch"])
        .controller("FoodController", Foodstrap.FoodController)
        .controller("EditVideosCtrl", EditVideosCtrl)
        .config(["$routeProvider", function ($routeProvider) {
            //configure route
            $routeProvider
                .when("/Start", {
                templateUrl: "/assets/templates/foodControllerTemplate.html",
                controller: "FoodController"
            })
                .when("/Cook", {
                templateUrl: "/assets/templates/cookControllerTemplate.html",
                controller: "CookController",
                reloadOnSearch: false
            });
        }]);
})(Foodstrap || (Foodstrap = {}));
