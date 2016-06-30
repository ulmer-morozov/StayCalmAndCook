var Foodstrap;
(function (Foodstrap) {
    "use strict";
    angular
        .module("app", [
        "ngRoute",
        "ngTouch",
        "ngAnimate",
        "debounce",
        "imagesLoaded"
    ])
        .controller("AppController", Foodstrap.AppController)
        .controller("FoodController", Foodstrap.FoodController)
        .controller("CookController", Foodstrap.CookController)
        .controller("CompleteController", Foodstrap.CompleteController)
        .config([
        "$routeProvider", function ($routeProvider) {
            $routeProvider
                .when("/Start", {
                templateUrl: "assets/templates/foodControllerTemplate.html",
                controller: "FoodController"
            })
                .when("/Cook", {
                templateUrl: "assets/templates/cookControllerTemplate.html",
                controller: "CookController",
                reloadOnSearch: false
            })
                .when("/Complete", {
                templateUrl: "assets/templates/completeControllerTemplate.html",
                controller: "CompleteController"
            })
                .otherwise("/Start");
        }
    ]);
})(Foodstrap || (Foodstrap = {}));
