import gsap from "gsap";
import {Container, Graphics, Sprite, Texture} from "pixi.js";
import {assetsLoader} from "../AssetsLoader.ts";
import {config} from "./config.ts";
import {SvgName} from "./types/enums.ts";

export const cardWidth = config.cardWidth;
export const cardHeight = config.cardHeight;

const createGradientTexture = (
    colorTop: string,
    colorBottom: string,
    width = cardWidth,
    height = cardHeight
): Texture => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return Texture.from(canvas);
};

const texture = createGradientTexture(config.cardGradient[0], config.cardGradient[1]);

export class Card extends Container {
    private shadowBackground!: Graphics;
    private background!: Graphics;
    private winSymbol!: Sprite;
    private loseSymbol!: Sprite;
    private _isWinner: boolean = false;
    private animationTimeline!: gsap.core.Timeline;
    private explosionBackground!: Sprite;

    constructor() {
        super();

        this.initialize();
    }

    public set isWinner(value: boolean) {
        this._isWinner = value;

        this.rotate();
    }

    public get isWinner(): boolean {
        return this._isWinner;
    }

    private initialize(): void {
        this.background = new Graphics();
        this.background.name = "CardBackground";
        this.background.lineStyle(1, 0xffffff, 0.6);
        this.background.beginTextureFill({ texture: texture });
        this.background.drawRoundedRect(0, 0, cardWidth, cardHeight, 10);
        this.background.endFill();

        this.background.pivot.x = this.background.width / 2;
        this.background.pivot.y = this.background.height / 2;
        this.addChild(this.background);

        this.winSymbol = new Sprite(assetsLoader.getSvg(SvgName.CROWN_SYMBOL));
        this.winSymbol.anchor.set(0.5);

        this.loseSymbol = new Sprite(assetsLoader.getSvg(SvgName.BOMB_SYMBOL));
        this.loseSymbol.anchor.set(0.5);

        this.shadowBackground = new Graphics();
        this.shadowBackground.beginFill(0x000000, 0.6);
        this.shadowBackground.drawRoundedRect(0, 0, cardWidth, cardHeight, 10);
        this.shadowBackground.endFill();
        this.shadowBackground.pivot.x = this.shadowBackground.width / 2;
        this.shadowBackground.pivot.y = this.shadowBackground.height / 2;
        this.shadowBackground.x = 3;
        this.shadowBackground.y = 3;
        gsap.set(this.shadowBackground, {
            pixi: {
                blur: 4
            }
        });
        this.addChildAt(this.shadowBackground, 0);

        this.explosionBackground = new Sprite();

        const explosionRedBg = new Graphics();
        explosionRedBg.beginFill(0x880808, 1);
        explosionRedBg.drawRoundedRect(0, 0, cardWidth, cardHeight, 4);
        explosionRedBg.endFill();
        explosionRedBg.pivot.x = explosionRedBg.width / 2;
        explosionRedBg.pivot.y = explosionRedBg.height / 2;
        explosionRedBg.alpha = 0;
        this.explosionBackground.addChild(explosionRedBg);

        const explosionWhiteLine = new Graphics();
        explosionWhiteLine.cacheAsBitmap = true;
        explosionWhiteLine.lineStyle(3, 0xffffff);
        explosionWhiteLine.drawRoundedRect(0, 0, cardWidth - 40, cardHeight - 40, 4);
        explosionWhiteLine.pivot.x = explosionWhiteLine.width / 2;
        explosionWhiteLine.pivot.y = explosionWhiteLine.height / 2;
        explosionWhiteLine.alpha = 0;
        this.explosionBackground.addChild(explosionWhiteLine);

        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerover", () => {
            gsap.set(this.background, {
                pixi: {
                    colorize: "red",
                    colorizeAmount: 0.1
                }
            });
        });

        this.on("pointerout", () => {
            //@ts-ignore
            this.background.filters = null;
        });
    }

    public rotate(): gsap.core.Timeline {
        this.eventMode = "none";
        this.cursor = "default";

        const symbol = this.isWinner ? this.winSymbol : this.loseSymbol;
        symbol.alpha = 0;

        const flipDuration = 0.3;

        this.animationTimeline = gsap.timeline({
            onComplete: () => {
                this.eventMode = "static";
                this.filters = null;
                this.background.filters = null;
            }
        });

        this.animationTimeline.to(this, {
            pixi: {
                scaleX: 0,
                scaleY: 1
            },
            duration: flipDuration,
            ease: "power2.in"
        });

        this.animationTimeline.to(this, {
            pixi: {
                scaleX: 1.1,
                scaleY: 1.1
            },
            duration: flipDuration,
            ease: "power2.out",
            onComplete: () => {
                this.addChild(symbol);
            }
        });

        this.animationTimeline.to(this, {
            pixi: {
                scaleX: 1,
                scaleY: 1
            },
            duration: 0.2,
            ease: "power3.in"
        });

        this.animationTimeline.to(
            symbol,
            {
                alpha: 1,
                duration: flipDuration / 2
            },
            ">-=0.2"
        );
        this.animationTimeline.to(
            symbol,
            {
                pixi: {
                    scaleX: 1.4,
                    scaleY: 1.4
                },
                yoyo: true,
                repeat: 1,
                duration: flipDuration / 2
            },
            "<"
        );

        if (this.isWinner) {
            this.animationTimeline.to(
                this.background,
                {
                    pixi: {
                        brightness: 1.4,
                        colorize: "white",
                        colorizeAmount: 1
                    },
                    duration: flipDuration,
                    ease: "power2.in"
                },
                `>-=${flipDuration}`
            );

            this.animationTimeline.to(this.background, {
                pixi: {
                    brightness: 1,
                    colorize: "none",
                    colorizeAmount: 0
                },
                duration: flipDuration * 2
            });
        } else {
            this.addChild(this.explosionBackground);

            this.animationTimeline.to(
                this.explosionBackground?.children[0] as Graphics,
                {
                    alpha: 1,
                    duration: flipDuration,
                    ease: "power2.in"
                },
                `>-=${flipDuration}+0.2`
            );

            this.animationTimeline.to(
                this.explosionBackground?.children[1] as Graphics,
                {
                    alpha: 1,
                    yoyo: true,
                    repeat: 5,
                    duration: flipDuration / 3
                },
                ">-=0.2"
            );

            this.animationTimeline.to(
                this.explosionBackground,
                {
                    alpha: 0,
                    duration: flipDuration
                },
                ">-0.1"
            );

            this.animationTimeline.to(
                symbol,
                {
                    pixi: {
                        colorize: "red",
                        brightness: 1.4
                    },
                    yoyo: true,
                    repeat: 5,
                    duration: flipDuration / 3,
                    onComplete: () => {
                        symbol.filters = null;
                    }
                },
                "> -0.74"
            );
        }

        this.parent?.addChild(this);

        return this.animationTimeline;
        // timeline.timeScale(0.2);
        // timeline.timeScale(1.2);
    }

    public reset(): void {
        this.interactiveChildren = true;
        this.eventMode = "static";
        this.cursor = "pointer";

        this.background.filters = null;
        this.winSymbol.filters = null;
        this.loseSymbol.filters = null;

        this.removeChild(this.winSymbol);
        this.removeChild(this.loseSymbol);

        this.animationTimeline?.kill();

        this.scale.set(1);
        this.alpha = 1;
    }
}
