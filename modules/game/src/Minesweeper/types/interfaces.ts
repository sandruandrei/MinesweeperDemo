import {GameState} from "../../abstracts/types/enums.ts";
import {DisplayConfig} from "../../abstracts/types/interfaces.ts";
import {BackgroundModule} from "../modules/BackgroundModule.ts";
import {ConnectionModule} from "../modules/ConnectionModule.ts";
import {GamesModule} from "../modules/GamesModule.ts";
import {IntroModule} from "../modules/IntroModule.ts";
import {SoundModule} from "../modules/SoundModule.ts";
import {UiModule} from "../modules/UiModule.ts";
import {GameName} from "./enums.ts";

export interface GameConfig {
    display: DisplayConfig;
    gamesNames: GameName[];
}

export interface IModule {
    onGameChange(gameMode: GameName): void;

    reset(): void;

    resize(resizeParams: { scaleFactor: number; windowWidth: number; windowHeight: number }): void;
}

export interface IGameManagerModules {
    background: BackgroundModule;
    games: GamesModule;
    ui: UiModule;
    sound: SoundModule;
    connection: ConnectionModule;
    intro: IntroModule;
}

export interface IGameFlow {
    next: GameState;
    when: () => boolean;
}

export interface IGameState {
    default: GameState;
    flows: IGameFlow[];
}

export interface IStateMachine {
    next(to: GameState): Promise<void>;
}

export interface IGameManagerModules {
    background: BackgroundModule;
    games: GamesModule;
    ui: UiModule;
    sound: SoundModule;
    connection: ConnectionModule;
    intro: IntroModule;
}

export interface CardData {
    rowId: number;
    columnId: number;
    isWinner?: boolean;
    round?: number;
}

export interface WinLevel {
    level: number;
    tokens: number;
    coins: number;
}
