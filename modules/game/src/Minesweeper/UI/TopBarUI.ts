import {Container, Graphics, Text} from "pixi.js";
import {CoinsAndTokensContainer} from "../CoinsAndTokensContainer.ts";
import {nullLevel, winLevels} from "../config.ts";
import {WinLevel} from "../types/interfaces.ts";

export class TopBarUI extends Container {
    protected graphicsContainer!: Graphics;
    protected userBalance!: CoinsAndTokensContainer;

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
        bg.drawRoundedRect(0, 0, w, h, 24);
        bg.endFill();
        bg.beginFill(0x1b452b);
        bg.drawRoundedRect(20, 20, w - extraBgBorderSize * 2, h - extraBgBorderSize * 2, 16);
        bg.endFill();
        this.graphicsContainer.addChild(bg);

        const balanceBg = new Graphics();
        balanceBg.beginFill(0x65d889);
        balanceBg.drawRoundedRect(0, 0, 200, 50, 18);
        balanceBg.endFill();
        balanceBg.x = 88;
        balanceBg.y = -30;
        this.graphicsContainer.addChild(balanceBg);

        const balanceText = new Text("BALANCE", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#ffffff",
            align: "center",
            fontWeight: "bold"
        });
        balanceText.name = "balanceText";

        balanceText.x = balanceBg.x + balanceBg.width / 2 - balanceText.width / 2;
        balanceText.y = balanceBg.y + balanceBg.height / 2 - balanceText.height / 2 - 4;
        this.graphicsContainer.addChild(balanceText);

        const maxPrizeBg = new Graphics();
        maxPrizeBg.beginFill(0xffffff);
        maxPrizeBg.drawRoundedRect(80, 0, 200, 50, 18);
        maxPrizeBg.endFill();
        maxPrizeBg.beginFill(0xffffff);
        maxPrizeBg.drawRoundedRect(0, 34, 360, 88, 24);
        maxPrizeBg.beginFill(0x1b452b);
        maxPrizeBg.drawRoundedRect(20, 52, 320, 50, 16);
        maxPrizeBg.endFill();
        maxPrizeBg.x = 360;
        maxPrizeBg.y = -34;
        this.graphicsContainer.addChild(maxPrizeBg);

        const maxPriceText = new Text("MAX PRIZE", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#1b452b",
            fontWeight: "bold"
        });
        maxPriceText.name = "maxPriceText";

        maxPriceText.x = maxPrizeBg.x + maxPrizeBg.width / 2 - maxPriceText.width / 2;
        maxPriceText.y = balanceText.y;
        this.graphicsContainer.addChild(maxPriceText);

        const maxWinToken = new CoinsAndTokensContainer({
            coins: winLevels.reduce((sum, level) => sum + level.coins, 0),
            tokens: winLevels.reduce((sum, level) => sum + level.tokens, 0),
            level: 0
        });
        maxWinToken.name = "maxWinToken";
        maxWinToken.x = 428;
        maxWinToken.y = 26;
        this.graphicsContainer.addChild(maxWinToken);

        this.userBalance = new CoinsAndTokensContainer({ ...nullLevel }, 60);
        this.userBalance.name = "userBalance" + Math.random();

        this.userBalance.updateBalance({ ...nullLevel }, true);
        this.userBalance.x = 166;
        this.userBalance.y = maxWinToken.y;
        this.addChild(this.userBalance);
    }

    public updateUserBalance(level: WinLevel, reset: boolean = false): gsap.core.Timeline {
        return this.userBalance.updateBalanceAnimation(level, reset);
    }

    public reset(): void {
        this.userBalance.updateBalance({ ...nullLevel }, true);
    }
}
