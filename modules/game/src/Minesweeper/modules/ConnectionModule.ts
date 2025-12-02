import {signalsManager} from "../../abstracts/signals/SignalsManager.ts";
import {SignalNames} from "../../abstracts/types/enums.ts";
import {flat, generateFilledArray, randomizeArray} from "../../abstracts/utils/arrays.ts";
import {config} from "../config.ts";
import {CardData} from "../types/interfaces.ts";
import {AbstractModule} from "./AbstractModule.ts";

const simulateNewCombinations = async () => {
    const bombs = 1 + Math.round(Math.random() * 2);

    const combinations: boolean[][] = generateFilledArray(
        config.rows,
        generateFilledArray(config.columns, true)
    );

    const flatCombinations: boolean[] = flat(combinations);

    for (let i = 0; i < bombs; i++) {
        flatCombinations[i] = false;
    }

    const randomizedCombinations = randomizeArray(flatCombinations);

    combinations.forEach((row, rowIndex) => {
        row.forEach((_, columnIndex) => {
            row[columnIndex] = randomizedCombinations[rowIndex * config.columns + columnIndex];
        });
    });

    return Promise.resolve(combinations);
};

export class ConnectionModule extends AbstractModule {
    private userId!: string;
    private combinations!: boolean[][];
    private roundCounter: number = 0;

    constructor() {
        super(null);

        this.init();
    }

    protected setupSignalsHandlers(): void {
        signalsManager.on(SignalNames.CONNECT_TO_SERVER, async () => {
            console.log(`%cSocketModule: connecting to server`, this.getConsoleLogStyle());
            await this.connectToServer();
        });

        signalsManager.on(SignalNames.SET_USER_ID, async (userId) => {
            this.userId = userId;

            await this.fetchUserData(this.userId);
        });

        signalsManager.on(SignalNames.CARD_CLICKED, async (cardData: CardData) => {
            const isWinner = await this.fetchCardValue(cardData.rowId, cardData.columnId);

            this.roundCounter++;

            signalsManager.emit(SignalNames.SET_CARD_VALUE, {
                rowId: cardData.rowId,
                columnId: cardData.columnId,
                isWinner: isWinner,
                round: this.roundCounter
            } as CardData);
        });
    }

    private async connectToServer(): Promise<void> {
        signalsManager.emit(SignalNames.CONNECTED_TO_SERVER);
    }

    private async fetchUserData(userId: string): Promise<void> {
        await this.generateCombination();

        signalsManager.emit(SignalNames.AUTH_COMPLETE, userId);
    }

    public async generateCombination(): Promise<void> {
        this.roundCounter = 0;

        const fakeFetch = async (): Promise<Response> => {
            console.log(
                `%cSocketModule: Generating New Win Matrix for user`,
                this.getConsoleLogStyle()
            );
            this.combinations = await simulateNewCombinations();

            const responseData = JSON.stringify(this.combinations);
            return new Response(responseData, {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        };

        try {
            const response = await fakeFetch();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.combinations = await response.json();

            console.log(
                `%cSocketModule: New Win Matrix generated -> ${JSON.stringify(this.combinations)}`,
                this.getConsoleLogStyle()
            );
        } catch (error) {
            console.error(
                `%cSocketModule: error fetching combinations -> ${error}`,
                this.getConsoleLogStyle()
            );
            throw error;
        }
    }

    private async fetchCardValue(rowId: number, columnId: number): Promise<boolean> {
        console.log(
            `%cSocketModule: fetching card[${rowId}][${columnId}] value`,
            this.getConsoleLogStyle()
        );

        const fakeFetch = async (): Promise<Response> => {
            const result = this.combinations[rowId][columnId];

            const responseData = JSON.stringify({ isWinner: result });
            return new Response(responseData, {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        };

        const response = await fakeFetch();
        const data = await response.json();

        console.log(
            `%cSocketModule: card[${rowId}][${columnId}] value fetched. isWinner -> ${data.isWinner}`,
            this.getConsoleLogStyle()
        );

        return data.isWinner;
    }

    protected getModuleName(): string {
        return `ConnectionModule`;
    }

    protected getConsoleLogTextColor(): string {
        return `#87CEEB`;
    }
}
