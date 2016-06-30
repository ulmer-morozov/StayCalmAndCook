module Foodstrap {
    export interface ICookCtrlScope extends ng.IScope {
        algorithm: IAlgorithm;
        sequences: Sequence[];
        k: number;

        progress: number;
        isLoaded: boolean;

        allSteps: IStep[];

        previousStep: IStep;
        currentStep: IStep;
        nextStep: IStep;

        currentTime: number;
        cookStartTime: number;
        offset: number;
        totalTime: number;

        prev(): void;
        repeat(): void;
        next(): void;

        formatLikeTimeSpan(totalMiliseconds: number): string;
        getVideoUrl(step: IStep): string;

        isCompleted: boolean;
        complete(): void;
    }
}