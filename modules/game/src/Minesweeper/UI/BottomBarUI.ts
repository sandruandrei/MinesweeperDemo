import gsap from "gsap";
import {Container, DisplayObject, Graphics, Sprite, Text} from "pixi.js";
import {assetsLoader} from "../../AssetsLoader.ts";
import {CoinsAndTokensContainer} from "../CoinsAndTokensContainer.ts";
import {winLevels} from "../config.ts";
import {SvgName} from "../types/enums.ts";

export class BottomBarUI extends Container {
    protected graphicsContainer!: Graphics;
    protected nextWinsContainer!: Container;
    protected currentRound!: CoinsAndTokensContainer;
    protected currentRoundText!: Text;

    constructor() {
        super();

        this.init();
    }

    protected init(): void {
        const w = 720;
        const h = 88;
        const extraBgBorderSize = 20;

        this.graphicsContainer = new Graphics();
        this.graphicsContainer.name = "GraphicsContainer";
        this.addChild(this.graphicsContainer);

        const bg = new Graphics();
        bg.beginFill(0x65d889);
        bg.drawRect(0, 0, w, h / 2);
        bg.beginFill(0x65d889);
        bg.drawRoundedRect(0, 0, w, h, 10);
        bg.endFill();
        // const extraBg = new Graphics();

        bg.beginFill(0x1b452b);
        bg.drawRoundedRect(20, 20, w - 2 * extraBgBorderSize, h - extraBgBorderSize * 2, 10);
        bg.beginFill(0x65d889);
        bg.drawRect(280, 0, 10, h);
        bg.endFill();

        bg.beginFill(0x65d889);
        bg.drawRoundedRect(0, 70, 200, 106, 10);
        bg.endFill();

        bg.beginFill(0x1b452b);
        bg.drawRoundedRect(20, 114, 160, 44, 8);
        bg.endFill();

        this.graphicsContainer.addChild(bg);

        const logoCrown = new Sprite(assetsLoader.getSvg(SvgName.CROWN_SYMBOL));
        logoCrown.name = `logoCrown`;
        logoCrown.x = 38;
        logoCrown.y = 109;
        logoCrown.scale.set(0.3);
        this.graphicsContainer.addChild(logoCrown);

        this.currentRoundText = new Text("0", {
            fontFamily: "Arial",
            fontSize: 48,
            fill: "#ffffff",
            align: "center",
            fontWeight: "bold"
        });

        this.currentRoundText.name = `currentRoundText`;
        this.currentRoundText.scale.set(0.5);
        this.currentRoundText.x = 98;
        this.currentRoundText.y =
            logoCrown.y + logoCrown.height / 2 - this.currentRoundText.height / 2;
        this.addChild(this.currentRoundText);

        const totalRoundsText = new Text("/ 8", {
            fontFamily: "Arial",
            fontSize: 48,
            fill: "#ffffff",
            align: "left"
        });

        totalRoundsText.name = `totalRundsText`;
        totalRoundsText.scale.set(0.5);
        totalRoundsText.x = this.currentRoundText.x + this.currentRoundText.width + 10;
        totalRoundsText.y = this.currentRoundText.y;
        this.graphicsContainer.addChild(totalRoundsText);

        this.nextWinsContainer = new Container();
        this.nextWinsContainer.name = "nextWinsContainer";
        this.nextWinsContainer.x = 300;

        const levelSpacing = 46;
        let currentWidth = 0;
        winLevels.forEach((level, index) => {
            if (index === 0) return;
            const nextWin = new CoinsAndTokensContainer(level, 10);

            nextWin.name = "nextWin_" + index;
            nextWin.x = currentWidth;
            nextWin.y = 26;
            this.nextWinsContainer.addChild(nextWin);
            currentWidth += nextWin.width + levelSpacing;
        });
        this.graphicsContainer.addChild(this.nextWinsContainer);

        const nextwinsContainerMask = new Graphics();
        nextwinsContainerMask.beginFill(0xffffff);
        nextwinsContainerMask.drawRect(0, 0, 410, 50);
        nextwinsContainerMask.endFill();
        nextwinsContainerMask.x = 290;
        nextwinsContainerMask.y = 20;

        this.nextWinsContainer.mask = nextwinsContainerMask;
        this.graphicsContainer.addChild(nextwinsContainerMask);

        this.currentRound = new CoinsAndTokensContainer();
        this.currentRound.name = "currentRound";

        this.currentRound.updateBalance({ ...winLevels[0] });
        this.currentRound.x = 152;
        this.currentRound.y = 26;
        this.addChild(this.currentRound);

        const nextPrizeText = new Text("NEXT PRIZE", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#ffffff",
            align: "center",
            fontWeight: "bold"
        });
        nextPrizeText.name = "nextPrizeText";

        nextPrizeText.x = 30;
        nextPrizeText.y = 82;

        this.graphicsContainer.addChild(nextPrizeText);
    }

    public moveToNextToken(round: number): gsap.core.Timeline {
        const tl = gsap.timeline({
            autoRemoveChildren: true,
            smoothChildTiming: true
        });

        const currentRoundAlpha0Animation = gsap.to(this.currentRound, {
            alpha: 0,
            duration: 0.2,
            pixi: {
                scale: 0.2
            },
            onComplete: () => {
                this.currentRound.scale.set(1);
                this.currentRound.updateBalance({ ...winLevels[round] }, true);

                this.currentRoundText.text = round.toString();
            }
        });

        tl.add(currentRoundAlpha0Animation, 0);

        if (round === winLevels.length) {
            return tl;
        }

        const currentRoundAlpha1Animation = gsap.to(this.currentRound, {
            alpha: 1,
            duration: 0.4
        });

        tl.add(currentRoundAlpha1Animation);

        if (round === winLevels.length) {
            return tl;
        }

        const child = this.nextWinsContainer.children[round - 1];
        const hideCurrentTokenTween = gsap.to(child, {
            alpha: 0,
            duration: 0.6,
            onComplete: () => {
                this.currentRound.updateBalance({ ...winLevels[round] }, true);
            }
        });
        tl.add(hideCurrentTokenTween, 0);

        const offset =
            round === winLevels.length - 1
                ? this.nextWinsContainer.width
                : this.nextWinsContainer.children[round].x;

        const moveContainerTween = gsap.to(this.nextWinsContainer, {
            x: 300 - offset,
            duration: 0.8
        });

        tl.add(moveContainerTween, 0);

        return tl;
    }

    public reset(): void {
        this.currentRound.alpha = 1;
        this.currentRound.scale.set(1);
        this.currentRoundText.text = "0";
        this.currentRound.updateBalance({ ...winLevels[0] }, true);

        gsap.killTweensOf(this.nextWinsContainer);
        gsap.killTweensOf(this.currentRound);

        this.nextWinsContainer.x = 300;

        this.nextWinsContainer.children.forEach((child: DisplayObject) => {
            child.alpha = 1;
        });
    }
}
