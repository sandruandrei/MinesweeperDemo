import {GameName, ImageName} from "./enums.ts";

export type BackgroundManifest = {
    [key in GameName]: {
        id: ImageName;
    };
};
