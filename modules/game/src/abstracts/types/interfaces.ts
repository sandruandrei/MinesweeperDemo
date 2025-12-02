import {TextStyleAlign} from "pixi.js";

import {SignalCallback} from "./types.ts";

export interface DisplayConfig {
    width: number;
    height: number;
}

export interface IGame {
    start(): Promise<void>;

    finish(): Promise<void>;

    reset(): Promise<void>;
}

export interface IGameManager {
    start(userId: string): Promise<void>;
}

export interface ISignalsManager {
    on(signalName: string, callback: SignalCallback): void;

    emit(signalName: string, ...args: any[]): void;
}

export interface Sound {
    id: string;
    volume: number;
    loop: boolean;
    sound: Howl;
}

export interface BitmapTextProps {
    text: string;
    style: {
        fontName: string;
        fontSize: number;
        align?: TextStyleAlign;
        tint?: number;
        letterSpacing?: number;
        maxWidth?: number;
    };
}
