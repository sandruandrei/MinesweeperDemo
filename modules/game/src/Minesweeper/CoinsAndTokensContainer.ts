import gsap from "gsap";
import {Container, Sprite, Text} from "pixi.js";
import {assetsLoader} from "../AssetsLoader.ts";
import {nullLevel} from "./config.ts";
import {SvgName} from "./types/enums.ts";
import {WinLevel} from "./types/interfaces.ts";

export class CoinsAndTokensContainer extends Container {
    private tokenContainer!: Container;
    private coinsContainer!: Container;
    private tokenText!: Text;
    private coinsText!: Text;
    private offsetFactor: number;
    private currentLevel: WinLevel;

    constructor(level: WinLevel = { ...nullLevel }, offsetFactor: number = 24) {
        super();

        this.offsetFactor = offsetFactor;

        this.currentLevel = level;

        this.init();
    }

    protected init(): void {
        this.tokenContainer = new Container();
        this.tokenContainer.name = `TokenContainer`;
        this.addChild(this.tokenContainer);

        const tokenSymbol = new Sprite(assetsLoader.getSvg(SvgName.LUCK_SYMBOL));
        tokenSymbol.width = 36;
        tokenSymbol.height = 36;
        this.tokenContainer.addChild(tokenSymbol);

        let tokenValue: number | string = this.currentLevel.tokens.toFixed(2);
        tokenValue = this.checkNumberFormat(+tokenValue);

        this.tokenText = new Text(tokenValue, {
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0xffffff,
            fontWeight: "bold"
        });
        this.tokenText.name = `TokenText`;
        this.tokenText.scale.set(0.5);
        this.tokenText.x = tokenSymbol.width + 6;
        this.tokenText.y = tokenSymbol.height / 2 - this.tokenText.height / 2;
        this.tokenContainer.addChild(this.tokenText);

        this.coinsContainer = new Container();
        this.coinsContainer.name = `CoinsContainer`;
        this.addChild(this.coinsContainer);

        const coinSymbol = new Sprite(assetsLoader.getSvg(SvgName.COIN_SYMBOL));
        coinSymbol.width = 36;
        coinSymbol.height = 36;
        this.coinsContainer.addChild(coinSymbol);

        let coinsValue: number | string = this.currentLevel.coins;
        coinsValue = this.checkNumberFormat(coinsValue);

        this.coinsText = new Text(coinsValue, {
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0xffffff,
            fontWeight: "bold"
        });
        this.coinsText.scale.set(0.5);
        this.coinsText.name = `CoinsText`;
        this.coinsText.x = coinSymbol.width + 6;
        this.coinsText.y = coinSymbol.height / 2 - this.coinsText.height / 2;
        this.coinsContainer.addChild(this.coinsText);

        this.coinsContainer.x =
            this.tokenContainer.x + this.tokenContainer.width + this.offsetFactor;
    }

    private checkNumberFormat(no: number): string {
        let newNumber: string | number = no;
        if (no >= 1000000) {
            newNumber = no / 1000000;
            newNumber = Math.round(newNumber * 10) / 10;
            newNumber = `${newNumber}M`;
        } else if (no >= 1000) {
            newNumber = no / 1000;
            newNumber = Math.round(newNumber * 10) / 10;
            newNumber = `${newNumber}K`;
        }

        return newNumber.toString();
    }

    public updateBalance(winLevel: WinLevel, reset: boolean = false): void {
        this.pivot.x = 0;

        if (reset) {
            this.currentLevel.tokens = 0;
            this.currentLevel.coins = 0;
        }

        this.currentLevel.tokens += winLevel.tokens;

        const tokenText = this.checkNumberFormat(+this.currentLevel.tokens);
        this.tokenText.text = tokenText;

        this.currentLevel.coins += winLevel.coins;

        const coinsText = this.checkNumberFormat(+this.currentLevel.coins);
        this.coinsText.text = coinsText;

        this.coinsContainer.x =
            this.tokenContainer.x + this.tokenContainer.width + this.offsetFactor;

        this.pivot.x = (this.coinsContainer.x + this.coinsContainer.width) / 2;
    }

    public updateBalanceAnimation(winLevel: WinLevel, reset: boolean = false): gsap.core.Timeline {
        if (reset) {
            this.updateBalance({ ...nullLevel }, true);
            return gsap.timeline({});
        }
        const newTokensAmount = this.currentLevel.tokens + winLevel.tokens;
        const tokenObj = {
            value: this.currentLevel.tokens
        };
        const newCoinsAmount = this.currentLevel.coins + winLevel.coins;
        const coinsObj = {
            value: this.currentLevel.coins
        };
        this.currentLevel.tokens = newTokensAmount;
        this.currentLevel.coins = newCoinsAmount;

        const tl = gsap.timeline({
            autoRemoveChildren: true,
            smoothChildTiming: true
        });

        const updateTokensetTextTween = gsap.to(tokenObj, {
            value: newTokensAmount,
            duration: 0.6,
            onUpdate: () => {
                this.tokenText.text = this.checkNumberFormat(Math.round(+tokenObj.value));
            }
        });

        tl.add(updateTokensetTextTween, 0);

        const updateCoinsTextTween = gsap.to(coinsObj, {
            value: newCoinsAmount,
            duration: 0.6,
            onUpdate: () => {
                this.coinsText.text = this.checkNumberFormat(+coinsObj.value);
            }
        });

        tl.add(updateCoinsTextTween, 0);

        return tl;
    }
}
