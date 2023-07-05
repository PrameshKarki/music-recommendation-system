import { IFilter } from "./pagination.interface";

export enum Mood {
    HAPPY = "HAPPY",
    SAD = "SAD",
    NEUTRAL = "NEUTRAL",
    NONE = "NONE"
}

export interface IMusicFilter extends IFilter {
    type?: Mood
}