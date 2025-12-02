import {Text} from "pixi.js";
import {assetsLoader} from "../../../AssetsLoader.ts";
import {SvgName} from "../../types/enums.ts";
import {PlayButton} from "./PlayButton.ts";

export class CashoutButton extends PlayButton {
    private btnText!: Text;

    protected get buttonSize(): number {
        return 120;
    }

    constructor() {
        super();
    }

    protected override getName(): string {
        return `CashoutButton`;
    }

    protected drawBackground() {}

    protected createOnTexture(): void {
        const texture = assetsLoader.getSvg(SvgName.CASH_ICON);

        this.onIcon.texture = texture;
        this.onIcon.width = this.buttonSize;
        this.onIcon.height = this.buttonSize - 50;

        this.btnText = new Text(`WITHDRAW`, {
            fontFamily: "Arial",
            fontSize: 44,
            fill: 0xff9900,
            fontWeight: "bold"
            // fontStyle: "italic"
        });
        this.btnText.name = `btnText`;
        this.btnText.x = this.onIcon.width / 2 - this.btnText.width / 4;
        this.btnText.y -= 20;
        this.btnText.scale.set(0.5);

        this.addChild(this.btnText);
    }

    protected createOffTexture(): void {}
}
