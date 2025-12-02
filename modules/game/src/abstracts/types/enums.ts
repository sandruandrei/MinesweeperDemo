export enum GameState {
    INITIAL = `initial`,
    LOADING_ASSETS = `loadingAssets`,
    LOADING_COMPLETE = `loadingComplete`,
    AUTH_STARTED = `authStarted`,
    AUTH_COMPLETE = `authComplete`,
    CONNECTING_TO_SERVER = `connectingToServer`,
    INITIALIZED = `initialized`,
    PLAY_GAME = `playGame`,
    RESTART_GAME = `restartGame`,
    CHANGE_GAME = `changeGame`,
    END_GAME = `endGame`
}

export enum SignalNames {
    // START_LOADING = `startLoading`,
    SET_USER_ID = `SET_USER_ID`,
    LOADING_COMPLETE = `loadingComplete`,
    ///////
    LOADING_FAILED = `loadingFailed`,
    CONNECT_TO_SERVER = `connectToServer`,
    ///////
    CONNECTED_TO_SERVER = `connectedToServer`,
    START_AUTH = `startAuth`,
    ///////
    AUTH_COMPLETE = `authComplete`,
    GAME_CHANGED = `gameChanged`,
    ///////

    SOUND_TOGGLE = `SOUND_TOGGLE`,
    ///////
    ///////
    CHANGE_GAME = `changeGameRequest`,
    ///////
    CARD_CLICKED = "CARD_CLICKED",
    SET_CARD_VALUE = "SET_CARD_VALUE",
    GAME_ENDED = `endGame`,
    GAME_RESTART = `gameRestart`
}

export enum Side {
    LEFT = `left`,
    RIGHT = `right`
}
