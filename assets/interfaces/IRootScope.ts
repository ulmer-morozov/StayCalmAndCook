module Foodstrap {
    export interface IRootScope extends ng.IRootScopeService {
        aboutIsShown: boolean;
        hideAbout(): void;
        showAbout(): void;
    }
}