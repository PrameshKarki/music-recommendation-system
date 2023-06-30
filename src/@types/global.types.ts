import { IFilter } from "./pagination.interface";

export enum Mood {
    HAPPY = "HAPPY",
    SAD = "SAD",
    NEUTRAL = "NEUTRAL"
}

export interface IMusicFilter extends IFilter {
    type?: Mood
}