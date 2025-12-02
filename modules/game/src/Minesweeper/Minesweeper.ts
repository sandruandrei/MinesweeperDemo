import gsap from "gsap";
import {Container, Graphics, Text} from "pixi.js";
import {signalsManager} from "../abstracts/signals/SignalsManager.ts";
import {AbstractGame} from "../abstracts/stateManagement/games/AbstractGame.ts";
import {SignalNames} from "../abstracts/types/enums.ts";
import {isMobile} from "../abstracts/utils";
import {Card, cardHeight, cardWidth} from "./Card.ts";
import {CoinsAndTokensContainer} from "./CoinsAndTokensContainer.ts";
import {config, nullLevel, winLevels} from "./config.ts";
import {SoundsManager} from "./modules/SoundModule.ts";
import {GameName, SoundNames} from "./types/enums.ts";
import {CardData, WinLevel} from "./types/interfaces.ts";
import {BottomBarUI} from "./UI/BottomBarUI.ts";
import {CashoutButton} from "./UI/buttons/CashoutButton.ts";
import {ReplayButton} from "./UI/buttons/ReplayButton.ts";
import {TopBarUI} from "./UI/TopBarUI.ts";

class Minesweeper extends AbstractGame {
    private cards!: Card[][];
    private cardsContainer!: Container;
    private topBar!: TopBarUI;
    private bottomBar!: BottomBarUI;
    private winText!: Text;
    private userToken!: CoinsAndTokensContainer;
    private currentWin: WinLevel = { ...nullLevel };
    private loseText!: Text;
    private cashoutBtn!: CashoutButton;

    constructor() {
        super(GameName.MINESWEEPER);

        this.postInit();
    }

    protected override initialize() {
        this.init();
    }

    protected addReplayButton(): void {
        this.replayBtn = new ReplayButton();
        this.replayBtn.x = this.playBtn.x;
        this.replayBtn.y = this.playBtn.y;

        this.replayBtn.on(isMobile() ? "pointerdown" : "click", () => {
            this.reset();

            this.removeChild(this.overgroundUI);

            this.onPlayButtonClicked();
        });
    }

    protected override postInit(): void {
        super.postInit();

        this.cardsContainer = new Container();
        this.cardsContainer.name = "CardsContainer";
        this.cardsContainer.x = 44; //cardWidth / 2 + extraBgBorderSize + spacing;
        this.cardsContainer.y = 44;

        const onCardClicked = (card: Card, cardData: CardData) => {
            card.interactiveChildren = false;
            card.eventMode = "none";

            signalsManager.emit(SignalNames.CARD_CLICKED, {
                rowId: cardData.rowId,
                columnId: cardData.columnId
            } as CardData);
        };

        const extraBgBorderSize = 20;

        const spacing = 12;

        const extraBg = new Graphics();
        extraBg.beginFill(0x1b452b);
        extraBg.drawRoundedRect(
            extraBgBorderSize,
            extraBgBorderSize,
            this.background.width - extraBgBorderSize * 2,
            this.background.height - extraBgBorderSize * 2,
            10
        );
        this.background.addChild(extraBg);
        this.background.cacheAsBitmap = true;

        this.cards = [];

        for (let i = 0; i < config.rows; i++) {
            const cardsRow: Card[] = [];

            for (let j = 0; j < config.columns; j++) {
                const card = new Card();
                card.x = cardWidth / 2 + i * (config.cardWidth + spacing);
                card.y = cardHeight / 2 + j * (config.cardHeight + spacing);

                cardsRow.push(card);
                this.cardsContainer.addChild(card);

                card.on(isMobile() ? "pointerdown" : "click", () => {
                    onCardClicked(card, { rowId: i, columnId: j } as CardData);

                    this.cardsContainer.interactiveChildren = false;
                    this.cardsContainer.eventMode = "none";

                    this.cashoutBtn.eventMode = "none";
                });
            }

            this.cards.push(cardsRow);
        }

        this.addChild(this.cardsContainer);

        this.topBar = new TopBarUI();
        this.topBar.y = -108;
        this.addChild(this.topBar);

        this.bottomBar = new BottomBarUI();
        this.bottomBar.y = 700;
        this.addChildAt(this.bottomBar, 0);

        const overgroundGraphics = this.overgroundUI.getChildAt(0) as Graphics;
        overgroundGraphics.x -= 1;
        overgroundGraphics.y = -142;
        overgroundGraphics.width += 2;
        overgroundGraphics.height = 1018;

        this.winText = new Text("YOU WIN!", {
            fontFamily: "Arial",
            fontSize: 128,
            fill: 0xffffff,
            align: "center",
            fontWeight: "bold"
        });
        this.winText.name = "WinText";
        this.winText.scale.set(0.5);
        this.winText.anchor.set(0.5);
        this.winText.x = this.background.width / 2;
        this.winText.y = 144;
        this.winText.visible = false;
        this.overgroundUI.addChild(this.winText);

        this.userToken = new CoinsAndTokensContainer({ ...nullLevel }, 48);
        this.userToken.updateBalance({ ...nullLevel });
        this.userToken.scale.set(1.4);
        this.userToken.x = this.winText.x;
        this.userToken.y = this.winText.y + 42;
        this.overgroundUI.addChild(this.userToken);

        this.loseText = new Text("YOU LOSE!", {
            fontFamily: "Arial",
            fontSize: 128,
            fill: 0xffffff,
            align: "center",
            fontWeight: "bold"
        });
        this.loseText.name = "LoseText";
        this.loseText.scale.set(0.5);
        this.loseText.anchor.set(0.5);
        this.loseText.x = this.background.width / 2;
        this.loseText.y = this.winText.y;
        this.overgroundUI.addChild(this.loseText);

        this.cashoutBtn = new CashoutButton();
        this.cashoutBtn.alpha = 0.4;

        this.cashoutBtn.on(isMobile() ? `pointerdown` : `click`, () => {
            this.onFinish(false);

            this.removeChild(this.cashoutBtn);
        });

        this.cashoutBtn.eventMode = "none";
        this.addChild(this.cashoutBtn);

        this.cashoutBtn.x = 590;
        this.cashoutBtn.y = 813;

        console.log(`%c★ ${this.name}: Initialization done`, this.getConsoleLogStyle());
    }

    protected override setupSignalsHandlers() {
        super.setupSignalsHandlers();

        signalsManager.on(SignalNames.SET_CARD_VALUE, (cardData: CardData) => {
            const card = this.cards[cardData.rowId][cardData.columnId];
            card.isWinner = cardData.isWinner!;

            this.gameTimeline = gsap.timeline({
                autoRemoveChildren: true,
                smoothChildTiming: true,
                onComplete: () => {
                    if (!card.isWinner || cardData.round === winLevels.length) {
                        if (!card.isWinner) {
                            this.topBar.updateUserBalance(nullLevel, true);

                            this.currentWin.tokens = 0;
                            this.currentWin.coins = 0;
                            this.userToken.updateBalance({ ...nullLevel }, true);

                            this.removeChild(this.cashoutBtn);
                        }

                        this.onFinish(!card.isWinner);
                    } else {
                        this.cardsContainer.interactiveChildren = true;
                        this.cardsContainer.eventMode = "static";

                        if (cardData.round! > 0) {
                            this.cashoutBtn.reset();
                            this.cashoutBtn.eventMode = "static";
                        }
                    }
                }
            });

            this.gameTimeline.add(card.rotate());

            if (card.isWinner) {
                const currentRound = cardData.round!;

                this.gameTimeline.add(this.bottomBar.moveToNextToken(currentRound), 0.8);

                this.gameTimeline.add(
                    this.topBar.updateUserBalance(winLevels[currentRound - 1]),
                    1
                );

                this.currentWin.tokens += winLevels[currentRound - 1].tokens;
                this.currentWin.coins += winLevels[currentRound - 1].coins;

                this.userToken.updateBalance({ ...this.currentWin }, true);
            }
        });
    }

    protected override getBackgroundColor(): number {
        return 0x65d889;
    }

    protected onStart(): Promise<void> {
        return Promise.resolve().then(() => {
            SoundsManager.changeMainTheme(SoundNames.GAME1);
        });
    }

    protected override onFinish(hasWon: boolean = false): Promise<void> {
        this.overgroundUI.removeChild(this.playBtn);
        this.removeChild(this.cashoutBtn);

        this.cardsContainer.eventMode = "none";

        if (this.enableWinningAnimation) {
            this.winningTimeline = gsap.timeline({
                smoothChildTiming: true,
                autoRemoveChildren: true,
                delay: 0.2,
                onComplete: () => {
                    this.overgroundUI.addChild(this.replayBtn);
                }
            });

            this.overgroundUI.addChild(this.winningContainer);

            this.winText.visible = !hasWon;
            this.userToken.visible = !hasWon;

            this.loseText.visible = hasWon;
        } else {
            this.overgroundUI.addChild(this.replayBtn);
        }

        this.addChild(this.overgroundUI);

        console.log(`%c★ ${this.name}: Game End`, this.getConsoleLogStyle());

        signalsManager.emit(SignalNames.GAME_ENDED);

        return Promise.resolve();
    }

    public override reset(): Promise<void> {
        signalsManager.emit(SignalNames.GAME_RESTART);

        this.cardsContainer.interactiveChildren = true;
        this.cardsContainer.eventMode = "static";

        this.cashoutBtn.reset();
        this.cashoutBtn.alpha = 0.4;
        this.cashoutBtn.eventMode = "none";
        this.addChild(this.cashoutBtn);

        this.overgroundUI.removeChild(this.replayBtn);
        this.replayBtn.reset();

        this.playBtn.reset();
        this.overgroundUI.addChild(this.playBtn);

        this.gameTimeline?.kill();

        this.cards.forEach((row) => {
            row.forEach((card) => {
                card.reset();
            });
        });

        this.bottomBar.reset();
        this.topBar.reset();

        this.currentWin.tokens = 0;
        this.currentWin.coins = 0;
        this.userToken.updateBalance({ ...nullLevel }, true);

        return Promise.resolve(undefined);
    }
}

export default Minesweeper;
