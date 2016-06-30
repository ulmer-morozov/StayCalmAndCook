module Foodstrap {
    "use strict";

    export class FoodController {

        //DI
        static $inject = [
            "$scope",
            "$routeParams",
            "$location",
            "$interval"
        ];

        constructor(
            private $scope: any,
            private $routeParams: ng.route.IRouteParamsService,
            private $location: ng.ILocationService,
            private $interval: ng.IIntervalService
        ) {
            //ctor
            //states
            var presentation = $scope.presentation = "presentation";
            var information = $scope.information = "information";
            $scope.state = presentation;
            //data
            $scope.product = {
                title: "Лёгкий суп\nиз лесных грибов",
                cooking:
                {
                    time: {
                        minutes: 45
                    },
                    difficulty: 3,
                    steps: 5,
                    portions: 4
                },
                ingridients: [
                    { title: "Лисички", fullTitle: "Лисички\n (или другие грибы)", weight: 300, icon: "Images/chanterelles.png", description: "Лучше всего подойдут свежие грибы, можно взять сушенные или замороженные." },
                    { title: "Картофель", fullTitle: "Картофель", weight: 400, icon: "Images/potato.png", description: "Свежий картофель отлично подойдет по вкусу грибов к грибам" },
                    { title: "Морковь", fullTitle: "Морковь", weight: 150, icon: "Images/carrot.png", description: "Лучший источник бета-картина, сгрядки или из магазина!" },
                    { title: "Репчатый лук", fullTitle: "Репчатый лук", weight: 50, icon: "Images/onion.png", description: "Немного лука никогда не повредит" },
                    { title: "Вода", fullTitle: "Вода", volume: 1.5, icon: "Images/water.png", description: "Чистая артезианская вода оказывает омолаживающий эффект" },
                    { title: "Соль", fullTitle: "Соль", amount: 1, icon: "Images/salt.png", description: "Можно добавить по желанию" },
                    { title: "Рис", fullTitle: "Рис", amount: 2, icon: "Images/rice.png", description: "Подойдет как круглозерный, так и длиннозерный рис." },
                    { title: "Петрушка", fullTitle: "Сушёная зелень петрушки", amount: 1, icon: "Images/parsley.png", description: "По желанию можно добавить другой зелени" },
                    { title: "Масло", fullTitle: "Растительное масло", amount: 2, icon: "Images/oil.png", description: "Подсолнечное, оливковое или льняное" }
                ]
            }

            //Helpers
            function updateStyle(ingridient) {
                //ingridient.transformStyle = "scale(" + ingridient.scale + ") rotate(" + ingridient.angle + "deg) translate(" + ingridient.radius + "pt) rotate(-" + ingridient.angle + "deg)";
                ingridient.transformStyle = "rotate3d(0,0,1," + ingridient.angle + "deg) translate3d(" + ingridient.radius + "pt,0,0) rotate3d(0,0,1, -" + ingridient.angle + "deg)";
            }

            //watch state
            $scope.$watch("state", function (newState) {
                var ingridient, i;
                var step = 360 / $scope.product.ingridients.length;
                switch (newState) {

                    case presentation:
                        for (i = 0; i < $scope.product.ingridients.length; i++) {
                            ingridient = $scope.product.ingridients[i];
                            ingridient.radius = 0;
                            ingridient.angle = 360;
                            ingridient.scale = 0.6;
                            updateStyle(ingridient);
                        }
                        $scope.productTransformStyle = "translate3d(0,0,0) scale3d(1.8,1.8,1.8)";
                        $scope.informationTransformStyle = "translate3d(140pt,0,0)";
                        break;

                    case information:
                        for (i = 0; i < $scope.product.ingridients.length; i++) {
                            ingridient = $scope.product.ingridients[i];
                            ingridient.radius = 100;
                            ingridient.angle = step * i;
                            ingridient.scale = 1;
                            updateStyle(ingridient);
                            $scope.productTransformStyle = "translate3d(-140pt,0,0) scale3d(1,1,1)";
                            $scope.informationTransformStyle = "translate3d(0,0,0)";
                        }
                        break;

                    default:
                        return;
                }
            });

            $scope.toggleState = function () {
                switch ($scope.state) {
                    case presentation:
                        $scope.state = information;
                        break;
                    case information:
                        $scope.state = presentation;
                        break;
                }
            }

            $scope.selectIngridient = function (ingridient) {
                if ($scope.currentIngridient != undefined) {
                    $scope.currentIngridient.active = false;
                }
                if (ingridient != undefined) {
                    ingridient.active = true;
                }
                $scope.currentIngridient = ingridient;
            }

            function showIngridientsByProgress(progress) {
                var panAmount = 200;
                var step = 360 / $scope.product.ingridients.length;
                for (var i = 0; i < $scope.product.ingridients.length; i++) {
                    var ingridient = $scope.product.ingridients[i];
                    var initialAngle = 540;
                    var initialRadius = 0;
                    var targetAngle = Math.round(i * step);
                    var targetRadius = 100;
                    //
                    ingridient.radius = initialRadius + (targetRadius - initialRadius) * progress;
                    ingridient.angle = initialAngle + (targetAngle - initialAngle) * progress;
                    ingridient.scale = 0.6 + 0.4 * Math.pow(progress, 2);
                    var transparecyValue = Math.pow(progress, 6);
                    ingridient.borderTransparency = "rgba(255, 255, 255, " + transparecyValue + ")";
                    updateStyle(ingridient);
                }
                $scope.foodLeftCoordinates = "calc(50% - " + 25 * progress + "%)";
                $scope.informationLeftCoordinates = "calc(50% + " + panAmount * (1 - progress) + "pt)";
            }

            function initialize() {
                showIngridientsByProgress($scope.ingridientsShowPreviousProgress);
            }

            //Инициализируем
            initialize();
        }
    }
}
