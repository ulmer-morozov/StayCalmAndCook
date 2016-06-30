module Foodstrap {
    "use strict";

    export class Sequence implements ICookStep {

        duration: number;
        startTime: number;
        endTime: number;
        tasks: ITask[];

        static new(task: ITask): Sequence {
            const sequence = new Sequence();
            sequence.startTime = task.startTime;
            sequence.endTime = task.startTime + task.duration;
            sequence.tasks = [task];
            return sequence;
        }
    }
}