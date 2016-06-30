module Foodstrap {
    export interface ITask extends ICookStep {
        title: string;
        steps: IStep[];
    }
}