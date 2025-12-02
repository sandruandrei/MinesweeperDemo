import {BlurFilter, Container, Graphics, Text} from "pixi.js";
import {pixiConfig} from "../config.ts";
import {UILoader} from "../UI/UILoader.ts";
import {AbstractModule} from "./AbstractModule.ts";

export class IntroModule extends AbstractModule {
    private introText: Text;
    private textContainer: Container;
    private moduleContainer: Container;
    private shadowGraphics: Graphics;
    private loader: UILoader;
    private readonly MODULE_WIDTH = 800;
    private readonly MODULE_HEIGHT = 800;
    private readonly TEXT_CONTAINER_WIDTH = 400;
    private readonly TEXT_MAX_WIDTH = 380;

    constructor() {
        super(null);

        this.init();
        this.moduleContainer = new Container();

        this.shadowGraphics = new Graphics();
        this.updateShadow();
        this.addChild(this.shadowGraphics);

        this.textContainer = new Container();

        const background = new Graphics();
        background.beginFill(0x000000, 0.6);
        background.drawRect(-this.TEXT_CONTAINER_WIDTH / 2, -100, this.TEXT_CONTAINER_WIDTH, 200);
        background.endFill();
        this.textContainer.addChild(background);

        this.introText = new Text(`Initializing...`, {
            fontFamily: `Arial`,
            fontSize: 24,
            fill: 0xffffff,
            align: `center`,
            wordWrap: true,
            wordWrapWidth: this.TEXT_MAX_WIDTH
        });

        this.introText.anchor.set(0.5);
        this.introText.x = 0;
        this.introText.y = 0;
        this.textContainer.addChild(this.introText);

        this.x = pixiConfig.width / 2;
        this.y = pixiConfig.height / 2;

        this.textContainer.x = 0;
        this.textContainer.y = 0;
        this.moduleContainer.addChild(this.textContainer);

        this.addChild(this.moduleContainer);

        this.loader = new UILoader();
        this.loader.scale.set(1);
        this.loader.start();

        this.addChild(this.loader);
    }

    public stopLoader(): void {
        this.loader.stop();
        this.removeChild(this.loader);
    }

    private updateShadow(): void {
        this.shadowGraphics.clear();
        this.shadowGraphics.beginFill(0x000000, 0.6);

        const shadowOffset = 2;
        const shadowBlur = 20;
        this.shadowGraphics.drawRect(
            -this.MODULE_WIDTH / 2 + shadowOffset,
            -this.MODULE_HEIGHT / 2 + shadowOffset,
            this.MODULE_WIDTH + shadowBlur,
            this.MODULE_HEIGHT + shadowBlur
        );
        this.shadowGraphics.endFill();

        this.shadowGraphics.filters = [new BlurFilter(10)];
    }

    protected init(): void {
        this.setupSignalsHandlers();
    }

    protected setupSignalsHandlers(): void {}

    public resize(): void {
        if (this.parent) {
            this.x = this.parent.width / (2 * this.parent.scale.x);
            this.y = this.parent.height / (2 * this.parent.scale.y);

            this.updateShadow();
        }
    }

    protected getModuleName(): string {
        return `IntroModule`;
    }

    protected getConsoleLogTextColor(): string {
        return `#FFD700`; // Gold color for intro module
    }
}
