var Foodstrap;
(function (Foodstrap) {
    "use strict";
    var CookController = (function () {
        function CookController($scope, $routeParams, $location, $interval, $timeout, $debounce) {
            var _this = this;
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.$debounce = $debounce;
            this.startedParamName = "started";
            this.offsetParamName = "offset";
            this.offsetChangeHandler = function (newOffsetValue) {
                _this.$location.replace();
                _this.$location.search("offset", newOffsetValue);
            };
            this.currentTimeChangeHandler = function (newCurrentTimeValue) {
                var timelineElement = angular.element(".sequences-container");
                var normalizedScroll = newCurrentTimeValue / _this.$scope.totalTime;
                var maxScroll = angular.element(".sequences").width();
                var newScroll = Math.floor(normalizedScroll * maxScroll);
                timelineElement.scrollLeft(newScroll);
            };
            this.populateAllSteps = function () {
                var tasks = _this.$scope.algorithm.tasks;
                var allSteps = [];
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i];
                    for (var j = 0; j < task.steps.length; j++) {
                        var step = task.steps[j];
                        step.task = task;
                        allSteps.push(step);
                    }
                }
                _this.$scope.allSteps = allSteps;
            };
            this.updateCookingStarTimeFromLocation = function () {
                var currentTime = parseInt(_this.$routeParams[_this.startedParamName]);
                if (isNaN(currentTime)) {
                    currentTime = new Date().getTime();
                    _this.$location.search(_this.startedParamName, currentTime);
                }
                _this.$scope.cookStartTime = currentTime;
            };
            this.updateCookingTimeOffsetFromLocation = function () {
                var currentOffset = parseInt(_this.$routeParams[_this.offsetParamName]);
                if (isNaN(currentOffset)) {
                    currentOffset = 0;
                    _this.$location.search(_this.offsetParamName, currentOffset);
                }
                _this.$scope.offset = currentOffset;
            };
            this.calculateTimings = function () {
                var tasks = _this.$scope.algorithm.tasks;
                for (var i = 0; i < tasks.length; i++) {
                    var totalMinutes = 0;
                    var task = tasks[i];
                    var steps = task.steps;
                    for (var j = 0; j < steps.length; j++) {
                        var step = steps[j];
                        step.startTime = task.startTime + totalMinutes;
                        step.endTime = step.startTime + step.duration;
                        totalMinutes += step.duration;
                    }
                    task.duration = totalMinutes;
                    task.endTime = task.startTime + task.duration;
                }
            };
            this.refreshSequences = function () {
                var sequences = [];
                var sequence = undefined;
                if (isNaN(_this.$scope.totalTime)) {
                    _this.$scope.totalTime = 0;
                }
                angular.forEach(_this.$scope.algorithm.tasks, function (task) {
                    if (sequence == undefined) {
                        sequence = Foodstrap.Sequence.new(task);
                        sequences.push(sequence);
                        return;
                    }
                    var anotherTaskCanBeInSequence = sequence.endTime <= task.startTime;
                    if (!anotherTaskCanBeInSequence) {
                        sequence = Foodstrap.Sequence.new(task);
                        sequences.push(sequence);
                        return;
                    }
                    sequence.tasks.push(task);
                    sequence.endTime += task.duration;
                    if (sequence.endTime > _this.$scope.totalTime) {
                        _this.$scope.totalTime = sequence.endTime;
                    }
                });
                _this.$scope.sequences = sequences;
            };
            this.startMetronom = function () {
                var intervalDuration = 1000;
                _this.$interval(_this.updateCurrentTime, intervalDuration);
            };
            this.minutes2Miliseconds = function (minutes) {
                var totalMiliseconds = minutes * 60 * 1000;
                return totalMiliseconds;
            };
            this.updateCurrentTime = function () {
                var relativeTime = new Date().getTime() - _this.$scope.cookStartTime;
                var time = relativeTime + _this.$scope.offset;
                if (time >= _this.$scope.totalTime) {
                    if (!_this.$scope.isCompleted) {
                        _this.$scope.complete();
                    }
                    time = _this.$scope.totalTime;
                }
                _this.$scope.currentTime = time;
                _this.refreshTimeLine(_this.$scope.currentTime);
            };
            this.seekToTime = function (newTime) {
                _this.$scope.offset += newTime - _this.$scope.currentTime;
                _this.updateCurrentTime();
            };
            this.refreshTimeLine = function (newTime) {
                var allSteps = _this.$scope.allSteps;
                var previousStep, currentStep, nextStep;
                for (var i = 0; i < allSteps.length; i++) {
                    var step = allSteps[i];
                    if (step.endTime < newTime)
                        continue;
                    if (step.startTime > newTime)
                        break;
                    currentStep = step;
                    previousStep = i > 0 ? allSteps[i - 1] : undefined;
                    nextStep = i + 1 < allSteps.length ? allSteps[i + 1] : undefined;
                }
                _this.$scope.previousStep = previousStep;
                _this.$scope.currentStep = currentStep;
                _this.$scope.nextStep = nextStep;
            };
            this.prevActionHandler = function () {
                var currentStep = _this.$scope.currentStep;
                var prevStep = _this.$scope.previousStep;
                if (prevStep == undefined) {
                    if (currentStep == undefined)
                        return;
                    _this.seekToTime(currentStep.startTime);
                    return;
                }
                _this.seekToTime(prevStep.startTime);
            };
            this.nextActionHandler = function () {
                var currentStep = _this.$scope.currentStep;
                var nextStep = _this.$scope.nextStep;
                if (nextStep == undefined) {
                    if (currentStep == undefined)
                        return;
                    _this.seekToTime(currentStep.endTime);
                    return;
                }
                _this.seekToTime(nextStep.startTime);
            };
            this.repeatActionHandler = function () {
                var currentStep = _this.$scope.currentStep;
                if (currentStep == undefined) {
                    return;
                }
                _this.seekToTime(currentStep.startTime);
            };
            this.formatLikeTimeSpan = function (totalMiliseconds) {
                if (isNaN(totalMiliseconds))
                    return;
                var msInSec = 1000;
                var msInMin = msInSec * 60;
                var msInHour = msInMin * 60;
                var hours = Math.floor(totalMiliseconds / msInHour);
                totalMiliseconds -= hours * msInHour;
                var minutes = Math.floor(totalMiliseconds / msInMin);
                totalMiliseconds -= minutes * msInMin;
                var seconds = Math.floor(totalMiliseconds / msInSec);
                var result = "";
                if (hours != 0)
                    result += hours + " \u0447 ";
                if (minutes != 0)
                    result += minutes + " \u043C\u0438\u043D ";
                if (seconds != 0)
                    result += seconds + " \u0441 ";
                result = result.trim();
                return result;
            };
            this.getVideoUrlHandler = function (step) {
                if (step == undefined)
                    return;
                var url = 'url(/assets/videos/' + step.video + ')';
                return url;
            };
            this.currentStepChange = function (step) {
                if (step == undefined) {
                    return;
                }
                var audio = new Audio("/assets/audio/" + step.audio);
                _this.audioTheme.volume = 0.7;
                audio.play();
                audio.onended = function () {
                    _this.audioTheme.volume = 1;
                };
                console.log("play audio " + step.audio);
            };
            this.completeActionHandler = function () {
                _this.$scope.isCompleted = true;
                _this.$location.path("/Complete");
            };
            var ctrl = this;
            $scope.k = 15 / (60 * 1000);
            $scope.progress = 10;
            $scope.algorithm = {
                tasks: [
                    {
                        title: "Подготовка грибов",
                        startTime: 0,
                        steps: [
                            {
                                action: "Замочите грибы",
                                description: "Если Вы используете сушеные грибы, то их необходимо замочить в прохладной воде примерно на один час.\r\n" +
                                    "Если Вы используете свежие грибы, то пропустите этот шаг",
                                video: "fillMushroomsWithWater2.gif",
                                audio: "fillMushroomsWithWater2.m4a",
                                duration: this.minutes2Miliseconds(60)
                            }
                        ]
                    },
                    {
                        title: "Нарезка овощей",
                        startTime: this.minutes2Miliseconds(36),
                        steps: [
                            {
                                action: "Помойте и очистите морковь от кожуры",
                                video: "peelCarrot.gif",
                                audio: "peelCarrot.m4a",
                                duration: this.minutes2Miliseconds(5)
                            },
                            {
                                action: "Помойте и очистите картошку от кожуры",
                                video: "peelPotato.gif",
                                audio: "peelPotato.m4a",
                                duration: this.minutes2Miliseconds(5)
                            },
                            {
                                action: "Мелко нарежьте морковь",
                                video: "cutCarrot.gif",
                                audio: "cutCarrot.m4a",
                                duration: this.minutes2Miliseconds(3)
                            },
                            {
                                action: "Помойте и мелко нарежьте репчатый лук",
                                video: "cutOnion.gif",
                                audio: "cutOnion.m4a",
                                duration: this.minutes2Miliseconds(5)
                            },
                            {
                                action: "Порежьте картошку на куски любой формы",
                                information: "Можно нарезать крупно",
                                video: "cutPotatos.gif",
                                audio: "cutPotato.m4a",
                                duration: this.minutes2Miliseconds(3)
                            }
                        ]
                    },
                    {
                        title: "Обжарка",
                        startTime: this.minutes2Miliseconds(57),
                        steps: [
                            {
                                action: "Налейте масло в катрюлю, добавьте морковку и лук, обжарьте овощи на большом огне.",
                                video: "stewOnionAndCarrot.gif",
                                audio: "stewOnionAndCarrot.m4a",
                                duration: this.minutes2Miliseconds(3),
                                important: true
                            },
                            {
                                action: "Добавьте в кастрюлю грибы",
                                information: "По желанию грибы можно тоже обжарить, чтобы суп был вкуснее.",
                                video: "stewMushrooms.gif",
                                audio: "stewMushrooms.m4a",
                                duration: this.minutes2Miliseconds(1),
                                important: true
                            }
                        ]
                    },
                    {
                        title: "Варка",
                        startTime: this.minutes2Miliseconds(61),
                        steps: [
                            {
                                action: "Аккуратно залейте в кастрюлю воду",
                                video: "fillWaterIntoPan.gif",
                                audio: "fillWaterIntoPan.m4a",
                                duration: this.minutes2Miliseconds(3)
                            },
                            {
                                action: "Перемешайте содержимое кастрюли и оставьте суп вариться",
                                video: "boiling.gif",
                                audio: "boiling.m4a",
                                duration: this.minutes2Miliseconds(2)
                            },
                            {
                                action: "Накройте кастрюлю крышкой и доведите суп до кипения",
                                video: "openPan.gif",
                                audio: "openPan.m4a",
                                duration: this.minutes2Miliseconds(12)
                            },
                            {
                                action: "Когда суп закипит добавьте в него картошку",
                                video: "putPotatoIntoPan.gif",
                                audio: "putPotatoIntoPan.m4a",
                                duration: this.minutes2Miliseconds(1)
                            },
                            {
                                action: "Промойте рис в воде и добавьте рис в суп",
                                video: "addRice.gif",
                                audio: "addRice.m4a",
                                duration: this.minutes2Miliseconds(4)
                            },
                            {
                                action: "Посолите и варите с закрытой крышкой",
                                video: "boiling.gif",
                                audio: "boiling.m4a",
                                duration: this.minutes2Miliseconds(10)
                            }
                        ]
                    },
                    {
                        title: "Сервировка",
                        startTime: this.minutes2Miliseconds(93),
                        steps: [
                            {
                                action: "Разлейте суп по тарелкам",
                                video: "stirSoup.gif",
                                audio: "serve.m4a",
                                duration: this.minutes2Miliseconds(5)
                            }
                        ]
                    }
                ]
            };
            $scope.isCompleted = false;
            function getMinStartTime(objects) {
                var minStartTime = Number.MAX_VALUE;
                angular.forEach(objects, function (object) {
                    if (object == undefined) {
                        return;
                    }
                    if (object.startTime < minStartTime) {
                        minStartTime = object.startTime;
                    }
                });
                return minStartTime;
            }
            function getMaxStartTime(objects) {
                var maxStartTime = 0;
                angular.forEach(objects, function (obj) {
                    if (obj == undefined) {
                        return;
                    }
                    if (obj.startTime > maxStartTime) {
                        maxStartTime = obj.startTime;
                    }
                });
                return maxStartTime;
            }
            function stardPlayAudioTheme() {
                ctrl.audioTheme = new Audio("/assets/audio/LondonMix.mp3");
                ctrl.audioTheme.loop = true;
                ctrl.audioTheme.play();
            }
            $scope.prev = this.prevActionHandler;
            $scope.next = this.nextActionHandler;
            $scope.repeat = this.repeatActionHandler;
            $scope.complete = this.completeActionHandler;
            $scope.getVideoUrl = this.getVideoUrlHandler;
            $scope.formatLikeTimeSpan = this.formatLikeTimeSpan;
            function initialize() {
                stardPlayAudioTheme();
                ctrl.updateCookingStarTimeFromLocation();
                ctrl.updateCookingTimeOffsetFromLocation();
                ctrl.calculateTimings();
                ctrl.populateAllSteps();
                ctrl.refreshSequences();
                ctrl.startMetronom();
                $timeout(function () {
                    ctrl.updateCurrentTime();
                    ctrl.refreshTimeLine($scope.currentTime);
                    $scope.$watch("offset", ctrl.offsetChangeHandler);
                    $scope.$watch("currentTime", ctrl.currentTimeChangeHandler);
                    $scope.$watch("currentStep", $debounce(ctrl.currentStepChange, 3000, true));
                });
            }
            $scope.$on('PROGRESS', function ($event, progress) {
                console.log(progress);
                $event.stopPropagation();
                switch (progress.status) {
                    case 'QUARTER':
                        $scope.progress = 25;
                        break;
                    case 'HALF':
                        $scope.progress = 50;
                        break;
                    case 'THREEQUARTERS':
                        $scope.progress = 75;
                        break;
                    case 'FULL':
                        $scope.progress = 100;
                        $scope.isLoaded = true;
                        initialize();
                        break;
                }
            });
            $scope.$on('SUCCESS', function () {
                console.log('ALL LOADED');
            });
        }
        CookController.$inject = [
            "$scope",
            "$routeParams",
            "$location",
            "$interval",
            "$timeout",
            "debounce"
        ];
        return CookController;
    }());
    Foodstrap.CookController = CookController;
})(Foodstrap || (Foodstrap = {}));
