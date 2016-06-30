var Foodstrap;
(function (Foodstrap) {
    "use strict";
    var Sequence = (function () {
        function Sequence() {
        }
        Sequence.new = function (task) {
            var sequence = new Sequence();
            sequence.startTime = task.startTime;
            sequence.endTime = task.startTime + task.duration;
            sequence.tasks = [task];
            return sequence;
        };
        return Sequence;
    }());
    Foodstrap.Sequence = Sequence;
})(Foodstrap || (Foodstrap = {}));
