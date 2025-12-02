import {Sprite} from "pixi.js";
import {assetsLoader} from "../../AssetsLoader.ts";
import {GameName, ImageName} from "../types/enums.ts";
import {BackgroundManifest} from "../types/types.ts";
import {AbstractModule} from "./AbstractModule.ts";

export class BackgroundModule extends AbstractModule {
    private normalBg!: Sprite;
    private currentBg!: Sprite;

    constructor(config: BackgroundManifest) {
        super(config);

        this.init();

        this.createSprites();
    }

    protected override getModuleName(): string {
        return `BackgroundModule`;
    }

    protected override handleConfig(): void {}

    protected override setupSignalsHandlers(): void {}

    private createSprites(): void {
        console.log(`%cBackgroundModule: Creating sprites`, this.getConsoleLogStyle());

        const normalTexture = assetsLoader.getTexture(ImageName.NORMAL_BG);
        this.normalBg = new Sprite(normalTexture);
        this.normalBg.anchor.set(0.5);
        this.normalBg.name = GameName.MINESWEEPER + " -bg";
        this.currentBg = this.normalBg;
        this.addChild(this.normalBg);
    }

    public override onGameChange(gameMode: GameName): void {
        console.log(
            `%cBackgroundModule: Game mode changed to ${gameMode}`,
            this.getConsoleLogStyle()
        );

        this.removeChildren();

        const initialX = this.currentBg.x;
        const initialY = this.currentBg.y;
        const initialScale = this.currentBg.scale.x;

        const config = this.config[gameMode];
        if (!config) {
            console.error(
                `%cBackgroundModule: No config for game mode ${gameMode}`,
                this.getConsoleLogStyle()
            );
            return;
        }

        switch (config.id) {
            case ImageName.NORMAL_BG:
            default:
                this.currentBg = this.normalBg;
                this.addChild(this.normalBg);
                break;
        }

        this.currentBg.x = initialX;
        this.currentBg.y = initialY;
        this.currentBg.scale.set(initialScale);
    }

    public override resize(resizeParams: {
        scaleFactor: number;
        windowWidth: number;
        windowHeight: number;
    }): void {
        const gameWidth = 1280;
        const gameHeight = 800;

        const viewportWidth = resizeParams.windowWidth / resizeParams.scaleFactor;
        const viewportHeight = resizeParams.windowHeight / resizeParams.scaleFactor;

        const scaleX = viewportWidth / this.currentBg.texture.width;
        const scaleY = viewportHeight / this.currentBg.texture.height;

        const scale = Math.max(scaleX, scaleY);
        this.currentBg.scale.set(scale);

        this.currentBg.position.set(gameWidth / 2, gameHeight / 2);
    }

    public override reset(): void {
        if (!this.normalBg) return;

        console.log(`%cBackgroundModule: Resetting`, this.getConsoleLogStyle());
    }

    protected override getConsoleLogTextColor(): string {
        return `white`;
    }
}
