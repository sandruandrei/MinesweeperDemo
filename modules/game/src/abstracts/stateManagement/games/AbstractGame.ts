import gsap from "gsap";
import {Container, Graphics, Sprite} from "pixi.js";
import {GameName} from "../../../Minesweeper/types/enums.ts";
import {IGame} from "../../types/interfaces.ts";
import {AbstractButton} from "../../ui/abstracts/AbstractButton.ts";
import {isMobile} from "../../utils";

export abstract class AbstractGame extends Container implements IGame {
    protected background!: Graphics;
    protected overgroundUI!: Container;
    protected playBtn!: AbstractButton;
    protected replayBtn!: AbstractButton;
    protected winningContainer!: Container;
    protected winningTimeline!: gsap.core.Timeline;
    protected gameTimeline!: gsap.core.Timeline;
    protected enableWinningAnimation: boolean = true;

    protected constructor(public name: GameName) {
        super();

        console.log(`%c★ ${this.name}: Initializing`, this.getConsoleLogStyle());
        this.setupSignalsHandlers();

        this.initialize();
    }

    protected initialize(): void {
        this.init();
        this.postInit();
    }

    protected init(): void {
        this.background = new Graphics();
        this.background.name = "GameBackground";
        this.background.beginFill(this.getBackgroundColor());
        this.background.drawRoundedRect(0, 0, 720, 720, 6);
        this.background.endFill();

        this.addChild(this.background);

        this.overgroundUI = new Container();
        this.overgroundUI.name = "OvergroundUI";

        const overgroundGraphics = new Graphics();
        overgroundGraphics.name = "UiOverground";
        overgroundGraphics.beginFill(0x000000, 0.8);
        overgroundGraphics.drawRect(0, 0, 720, 720);
        overgroundGraphics.endFill();
        this.overgroundUI.addChild(overgroundGraphics);

        this.addPlayButton();

        this.addReplayButton();

        this.winningContainer = new Container();
        this.winningContainer.y = 84;

        this.winningContainer.x =
            this.overgroundUI.width / 2 - this.winningContainer.width / 2 + 40;
    }

    protected addPlayButton(): void {
        this.playBtn = new AbstractButton();
        this.playBtn.x = 320;
        this.playBtn.y = 320;

        this.playBtn.on(isMobile() ? "pointerdown" : "click", () => {
            this.removeChild(this.overgroundUI);

            this.onPlayButtonClicked();
        });

        this.overgroundUI.addChild(this.playBtn);
    }

    protected addReplayButton(): void {
        this.replayBtn = new AbstractButton();
        this.replayBtn.x = this.playBtn.x;
        this.replayBtn.y = this.playBtn.y;

        this.replayBtn.on(isMobile() ? "pointerdown" : "click", () => {
            this.reset();

            this.removeChild(this.overgroundUI);

            this.onPlayButtonClicked();
        });
    }

    protected onPlayButtonClicked(): void {}

    protected postInit(): void {
        console.log(`%c★ ${this.name}: Post-init`, this.getConsoleLogStyle());
    }

    public async start(): Promise<void> {
        console.log(`%c★ ${this.name}: Starting`, this.getConsoleLogStyle());
        await this.onStart();
    }

    public async finish(): Promise<void> {
        console.log(`%c★ ${this.name}: Finishing`, this.getConsoleLogStyle());
        await this.onFinish();
        // await this.stateMachine.next();
    }

    protected onStart(): Promise<void> {
        return Promise.resolve().then(() => {
            this.reset();
        });
    }

    protected onFinish(): Promise<void> {
        this.overgroundUI.removeChild(this.playBtn);

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

            this.winningContainer.children.forEach((child) => {
                child.alpha = 0;
                if (child instanceof Sprite) {
                    child.scale.set(0.14);

                    const starTween = gsap.to(child, {
                        alpha: 1,
                        pixi: { scale: 0.1 },
                        duration: 0.3
                    });

                    this.winningTimeline.add(starTween);
                }
            });
        } else {
            this.overgroundUI.addChild(this.replayBtn);
        }

        this.addChild(this.overgroundUI);

        return Promise.resolve();
    }

    protected getConsoleLogTextColor(): string {
        return `white`;
    }

    protected getConsoleLogStyle(): string {
        return `color: ${this.getConsoleLogTextColor()}; background-color: black; font-weight: bold;`;
    }

    protected setupSignalsHandlers(): void {}

    protected getBackgroundColor(): number {
        return 0x000000;
    }

    protected resetTimeline(): void {
        if (this.gameTimeline) {
            this.gameTimeline.kill();
        }

        this.gameTimeline = gsap.timeline({
            autoRemoveChildren: true,
            smoothChildTiming: true,
            onComplete: () => {
                this.onFinish();
            }
        });
    }

    reset(): Promise<void> {
        return Promise.resolve();
    }
}
