import {GameState} from "../abstracts/types/enums.ts";
import {AssetManifest} from "../abstracts/types/types.ts";
import {FontsNames, GameName, ImageName, SoundNames, SvgName} from "./types/enums.ts";
import {GameConfig, IGameState, WinLevel} from "./types/interfaces.ts";
import {BackgroundManifest} from "./types/types.ts";

export const gameStatesConfig: IGameState[] = [
    {
        default: GameState.INITIAL,
        flows: [{ next: GameState.LOADING_ASSETS, when: () => true }]
    },
    {
        default: GameState.LOADING_ASSETS,
        flows: [{ next: GameState.LOADING_COMPLETE, when: () => true }]
    },
    {
        default: GameState.LOADING_COMPLETE,
        flows: [{ next: GameState.CONNECTING_TO_SERVER, when: () => true }]
    },
    {
        default: GameState.CONNECTING_TO_SERVER,
        flows: [{ next: GameState.AUTH_STARTED, when: () => true }]
    },
    {
        default: GameState.AUTH_STARTED,
        flows: [{ next: GameState.AUTH_COMPLETE, when: () => true }]
    },
    {
        default: GameState.AUTH_COMPLETE,
        flows: [{ next: GameState.INITIALIZED, when: () => true }]
    },
    {
        default: GameState.INITIALIZED,
        flows: [{ next: GameState.CHANGE_GAME, when: () => true }]
    },
    {
        default: GameState.CHANGE_GAME,
        flows: [{ next: GameState.PLAY_GAME, when: () => true }]
    },
    {
        default: GameState.PLAY_GAME,
        flows: [
            { next: GameState.CHANGE_GAME, when: () => true },
            { next: GameState.END_GAME, when: () => true }
        ]
    },
    {
        default: GameState.END_GAME,
        flows: [{ next: GameState.PLAY_GAME, when: () => true }]
    }
];

export const assetsConfig: AssetManifest = {
    images: {
        [ImageName.NORMAL_BG]: `/images/bg/normal.png`,
        [ImageName.LOADER]: `/images/misc/loadingIcon.png`
    },
    spritesheets: {},
    videos: {},
    audio: {
        [SoundNames.GAME1]: `/sounds/game1.mp3`
    },
    svgs: {
        [SvgName.PLAY_ICON]: `/svgs/playIcon.svg`,
        [SvgName.PLAY_ICON_SILVER]: `/svgs/playIconSilver.svg`,
        [SvgName.REPLAY_ICON]: `/svgs/replayIcon.svg`,
        [SvgName.FAST_ICON]: `/svgs/fastIcon.svg`,
        [SvgName.STAR_ICON]: `/svgs/starIcon.svg`,
        [SvgName.SOUND_ON]: `/svgs/soundOn.svg`,
        [SvgName.SOUND_OFF]: `/svgs/soundOff.svg`,
        [SvgName.BOMB_SYMBOL]: `/svgs/bomb.svg`,
        [SvgName.CROWN_SYMBOL]: `/svgs/crown.svg`,
        [SvgName.LUCK_SYMBOL]: `/svgs/luck.svg`,
        [SvgName.COIN_SYMBOL]: `/svgs/coin.svg`,
        [SvgName.CASH_ICON]: `/svgs/cashout.svg`
    },
    fonts: {
        ttf: {},
        bitmap: {
            [FontsNames.MENU_FONT]: `/fonts/bitmapFonts/menuFont.fnt`
        }
    }
};

export const gamesConfig: GameConfig = {
    gamesNames: [GameName.MINESWEEPER],
    display: {
        width: 1280,
        height: 800
    }
};

export const pixiConfig = {
    width: gamesConfig.display.width,
    height: gamesConfig.display.height,
    backgroundColor: 0x000000,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 2
};

export const backgroundConfig: BackgroundManifest = {
    [GameName.MINESWEEPER]: { id: ImageName.NORMAL_BG }
};

export const soundConfig = {};

export const config = {
    ...gamesConfig,
    rows: 3,
    columns: 3,
    cardWidth: 203,
    cardHeight: 203,
    cardGradient: ["#ffcc00", "#ff9900"],
    borderRadius: 10
};

export const nullLevel: WinLevel = {
    level: 0,
    coins: 0,
    tokens: 0
};

export const winLevels: WinLevel[] = [
    {
        level: 0,
        tokens: 10,
        coins: 200000
    },
    {
        level: 1,
        tokens: 25,
        coins: 500000
    },
    {
        level: 2,
        tokens: 40,
        coins: 800000
    },
    {
        level: 3,
        tokens: 75,
        coins: 2000000
    },
    {
        level: 4,
        tokens: 100,
        coins: 3000000
    },
    {
        level: 5,
        tokens: 250,
        coins: 5000000
    },
    {
        level: 6,
        tokens: 500,
        coins: 10000000
    },
    {
        level: 7,
        tokens: 2500,
        coins: 50000000
    }
];
