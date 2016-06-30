module Foodstrap {
    "use strict";

    export class CookController {

        static $inject = [
            "$scope",
            "$routeParams",
            "$location",
            "$interval",
            "$timeout",
            "debounce"
        ];

        private startedParamName = "started";
        private offsetParamName = "offset";

        private audioTheme: HTMLAudioElement;

        constructor(
            private $scope: ICookCtrlScope,
            private $routeParams: ng.route.IRouteParamsService,
            private $location: ng.ILocationService,
            private $interval: ng.IIntervalService,
            private $timeout: ng.ITimeoutService,
            private $debounce: any) {
            var ctrl = this;
            //ctor
            //initial data
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
                                video: "fillWaterInToPan.gif",
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
            //

            function getMinStartTime(objects) {
                var minStartTime = Number.MAX_VALUE;
                angular.forEach(objects, function(object) {
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
                angular.forEach(objects, function(obj) {
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
                ctrl.audioTheme = new Audio("assets/audio/LondonMix.mp3");
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
                $timeout(() => {
                    ctrl.updateCurrentTime();
                    ctrl.refreshTimeLine($scope.currentTime);
                    //addWatchers
                    $scope.$watch("offset", ctrl.offsetChangeHandler);
                    $scope.$watch("currentTime", ctrl.currentTimeChangeHandler);
                    $scope.$watch("currentStep", $debounce(ctrl.currentStepChange, 3000, true));
                });//tmp
            }

            //Инициализируем

            $scope.$on('PROGRESS', function($event, progress) {
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

            $scope.$on('SUCCESS', function() {
                console.log('ALL LOADED');
            });

        }

        //Handlers
        offsetChangeHandler = (newOffsetValue: number): void => {
            this.$location.replace();
            this.$location.search("offset", newOffsetValue);
        }

        currentTimeChangeHandler = (newCurrentTimeValue: number): void => {
            var timelineElement = angular.element(".sequences-container");
            var normalizedScroll = newCurrentTimeValue / this.$scope.totalTime;
            var maxScroll = angular.element(".sequences").width();
            var newScroll = Math.floor(normalizedScroll * maxScroll);
            timelineElement.scrollLeft(newScroll);
        }

        //Help methods

        populateAllSteps = (): void => {
            var tasks = this.$scope.algorithm.tasks;
            var allSteps = [];

            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                for (var j = 0; j < task.steps.length; j++) {
                    var step = task.steps[j];
                    step.task = task;
                    allSteps.push(step);
                }
            }
            this.$scope.allSteps = allSteps;
        }

        updateCookingStarTimeFromLocation = (): void => {
            var currentTime = parseInt(this.$routeParams[this.startedParamName]);
            //currentTime = new Date().getTime();//temp
            if (isNaN(currentTime)) {
                currentTime = new Date().getTime();
                this.$location.search(this.startedParamName, currentTime);
            }
            this.$scope.cookStartTime = currentTime;
        }

        updateCookingTimeOffsetFromLocation = (): void => {
            var currentOffset = parseInt(this.$routeParams[this.offsetParamName]);
            //currentOffset = 5694185;//temp
            if (isNaN(currentOffset)) {
                currentOffset = 0;
                this.$location.search(this.offsetParamName, currentOffset);
            }
            this.$scope.offset = currentOffset;
        }

        calculateTimings = (): void => {
            var tasks = this.$scope.algorithm.tasks;
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
        }

        refreshSequences = (): void => {
            var sequences: Sequence[] = [];
            var sequence = undefined;
            if (isNaN(this.$scope.totalTime)) {
                this.$scope.totalTime = 0;
            }
            angular.forEach(this.$scope.algorithm.tasks, (task: ITask) => {
                if (sequence == undefined) {
                    sequence = Sequence.new(task);
                    sequences.push(sequence);
                    return;
                }
                var anotherTaskCanBeInSequence = sequence.endTime <= task.startTime;
                if (!anotherTaskCanBeInSequence) {
                    sequence = Sequence.new(task);
                    sequences.push(sequence);
                    return;
                }
                sequence.tasks.push(task);
                sequence.endTime += task.duration;
                if (sequence.endTime > this.$scope.totalTime) {
                    this.$scope.totalTime = sequence.endTime;
                }
            });
            this.$scope.sequences = sequences;
        }

        startMetronom = (): void => {
            var intervalDuration = 1000;
            this.$interval(this.updateCurrentTime, intervalDuration);
        }

        minutes2Miliseconds = (minutes: number): number => {
            const totalMiliseconds = minutes * 60 * 1000;
            return totalMiliseconds;
        }

        updateCurrentTime = (): void => {
            var relativeTime = new Date().getTime() - this.$scope.cookStartTime;
            var time = relativeTime + this.$scope.offset;
            if (time >= this.$scope.totalTime) {
                if (!this.$scope.isCompleted) {
                    this.$scope.complete();
                }
                time = this.$scope.totalTime;
            }
            //
            this.$scope.currentTime = time;
            this.refreshTimeLine(this.$scope.currentTime);
        }

        seekToTime = (newTime: number) => {
            this.$scope.offset += newTime - this.$scope.currentTime;
            this.updateCurrentTime();
        }

        refreshTimeLine = (newTime: number): void => {
            var allSteps = this.$scope.allSteps;
            var previousStep: IStep, currentStep: IStep, nextStep: IStep;

            for (var i = 0; i < allSteps.length; i++) {
                var step = allSteps[i];
                if (step.endTime < newTime)
                    continue;
                //
                if (step.startTime > newTime)
                    break;
                //
                currentStep = step;
                previousStep = i > 0 ? allSteps[i - 1] : undefined;
                nextStep = i + 1 < allSteps.length ? allSteps[i + 1] : undefined;
            }

            this.$scope.previousStep = previousStep;
            this.$scope.currentStep = currentStep;
            this.$scope.nextStep = nextStep;
        }

        prevActionHandler = (): void => {
            var currentStep = this.$scope.currentStep;
            var prevStep = this.$scope.previousStep;
            if (prevStep == undefined) {
                if (currentStep == undefined)
                    return;
                this.seekToTime(currentStep.startTime);
                return;
            }
            this.seekToTime(prevStep.startTime);
        }

        nextActionHandler = (): void => {
            var currentStep = this.$scope.currentStep;
            var nextStep = this.$scope.nextStep;
            if (nextStep == undefined) {
                if (currentStep == undefined)
                    return;
                this.seekToTime(currentStep.endTime);
                return;
            }
            this.seekToTime(nextStep.startTime);
        }

        repeatActionHandler = (): void => {
            var currentStep = this.$scope.currentStep;
            if (currentStep == undefined) {
                return;
            }
            this.seekToTime(currentStep.startTime);
        }

        formatLikeTimeSpan = (totalMiliseconds: number): string => {
            if (isNaN(totalMiliseconds))
                return;
            //
            var msInSec = 1000;
            var msInMin = msInSec * 60;
            var msInHour = msInMin * 60;

            var hours = Math.floor(totalMiliseconds / msInHour);
            totalMiliseconds -= hours * msInHour;
            var minutes = Math.floor(totalMiliseconds / msInMin)
            totalMiliseconds -= minutes * msInMin;
            var seconds = Math.floor(totalMiliseconds / msInSec);

            var result = "";
            if (hours != 0)
                result += `${hours} ч `;
            //
            if (minutes != 0)
                result += `${minutes} мин `;
            //
            if (seconds != 0)
                result += `${seconds} с `;
            //
            result = result.trim();
            return result;
        }

        getVideoUrlHandler = (step: IStep): string => {
            if (step == undefined)
                return;
            //
            var url = 'url(assets/videos/' + step.video + ')';
            return url;
        }

        currentStepChange = (step: IStep): void => {
            if (step == undefined) {
                return;
            }

            var audio = new Audio(`assets/audio/${step.audio}`);
            this.audioTheme.volume = 0.7;
            audio.play();
            audio.onended = () => {
                this.audioTheme.volume = 1;
            }
            console.log(`play audio ${step.audio}`);
        }

        completeActionHandler = (): void => {
            this.$scope.isCompleted = true;
            this.$location.path("/Complete");
        }

    }
}
