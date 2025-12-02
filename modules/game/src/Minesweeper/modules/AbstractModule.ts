import {Container} from "pixi.js";
import {GameName} from "../types/enums.ts";
import {IModule} from "../types/interfaces.ts";

export class AbstractModule extends Container implements IModule {
    constructor(protected config: any) {
        super();
    }

    protected init(): void {
        this.name = this.getModuleName();
        this.setupSignalsHandlers();
        this.handleConfig();

        console.log(`%c${this.getModuleName()} module initialized`, this.getConsoleLogStyle());
    }

    protected setupSignalsHandlers(): void {}

    protected handleConfig(): void {}

    public onGameChange(gameName: GameName): void {
        console.log(
            `%c${this.getModuleName()}: Game changed to ${gameName}`,
            this.getConsoleLogStyle()
        );
    }

    // @ts-ignore
    public resize(resizeParams: {
        scaleFactor: number;
        windowWidth: number;
        windowHeight: number;
    }): void {}

    protected getModuleName(): string {
        return `AbstractModule`;
    }

    protected getConsoleLogTextColor(): string {
        return `#white`;
    }

    protected getConsoleLogStyle(): string {
        return `color: ${this.getConsoleLogTextColor()}; background-color: #006400; font-weight: bold;`;
    }

    public reset(): void {}
}
