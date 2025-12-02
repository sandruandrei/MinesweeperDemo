import {Container, Graphics, Sprite} from "pixi.js";
import {assetsLoader} from "../../AssetsLoader.ts";
import {AbstractBitmapText} from "../../abstracts/graphics/AbstractBitmapText.ts";
import {SoundButton} from "../../abstracts/ui/buttons/SoundButton.ts";
import {gamesConfig} from "../config.ts";
import {FontsNames, SvgName} from "../types/enums.ts";

export abstract class Menu extends Container {
    protected menuBg!: Graphics;
    protected soundBtn!: SoundButton;
    protected logo!: Container;

    constructor() {
        super();
        this.name = `UiMenu`;
        this.createButtons();
        this.createBackground();
        this.createFields();
    }

    private createFields(): void {
        this.logo = new Container();
        this.logo.name = `Logo`;

        const logoText = new AbstractBitmapText({
            text: "LUCKYNMINER",
            style: {
                fontName: FontsNames.MENU_FONT,
                fontSize: 48
            }
        });

        logoText.name = `logoText`;
        this.logo.addChild(logoText);

        const logoCrown = new Sprite(assetsLoader.getSvg(SvgName.CROWN_SYMBOL));
        logoCrown.name = `logoCrown`;
        logoCrown.x = -34;
        logoCrown.y = -12;
        logoCrown.anchor.set(0.15);
        logoCrown.scale.set(0.15);
        this.logo.addChild(logoCrown);

        const logoBomb = new Sprite(assetsLoader.getSvg(SvgName.BOMB_SYMBOL));
        logoBomb.name = `logoBomb`;
        logoBomb.x = 56;
        logoBomb.y = -15;
        logoBomb.anchor.set(0.15);
        logoBomb.scale.set(0.15);
        this.logo.addChild(logoBomb);

        this.addChild(this.logo);
    }

    private createBackground(): void {
        this.menuBg = new Graphics();
        this.menuBg.name = `menuBg`;

        this.addChildAt(this.menuBg, 0);

        this.menuBg.addChild(this.soundBtn);
    }

    private createButtons(): void {
        this.soundBtn = new SoundButton();
        this.soundBtn.scale.set(0.8);
        this.soundBtn.x = 240;
        this.soundBtn.y = 2;
    }

    public resize({
        scaleFactor = 1,
        windowHeight = gamesConfig.display.height
    }: {
        scaleFactor: number;
        windowWidth: number;
        windowHeight: number;
    }): void {
        const stageHeight = windowHeight / scaleFactor;

        this.menuBg.x = 640;
        this.menuBg.y = -stageHeight / 2 + 418;

        this.logo.x = this.menuBg.x;
        this.logo.y = this.menuBg.y;
    }
}
