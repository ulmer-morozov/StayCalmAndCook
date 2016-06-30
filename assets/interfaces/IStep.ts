module Foodstrap {
    export interface IStep extends ICookStep {
        action: string;
        description?: string;
        information?: string;
        video?: string;
        audio?: string;
        important?: boolean;

        task?: ITask;
    }
}