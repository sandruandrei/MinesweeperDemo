import {Menu} from "../UI/Menu.ts";
import {AbstractModule} from "./AbstractModule.ts";

export class UiModule extends AbstractModule {
    private menu!: Menu;

    constructor(protected config: any) {
        super(config);

        this.init();
    }

    protected init(): void {
        this.name = this.getModuleName();
        this.handleConfig();

        this.menu = this.getButtons();

        this.addChild(this.menu);

        this.setupSignalHandlers();

        console.log(`%c${this.getModuleName()} module initialized`, this.getConsoleLogStyle());
    }

    protected setupSignalHandlers(): void {}

    protected getModuleName(): string {
        return `UiModule`;
    }

    protected getButtons(): Menu {
        return new (class extends Menu {})();
    }

    protected handleConfig(): void {}

    public resize(resizeParams: {
        scaleFactor: number;
        windowWidth: number;
        windowHeight: number;
    }): void {
        this.menu?.resize(resizeParams);
    }

    protected getConsoleLogTextColor(): string {
        return `#4a90e2`;
    }
}
