import * as vscode from "vscode";

import savePlace from "../modules/saveplace";
import getGameInfo from "../modules/getgameinfo";
import getPlaces from "../modules/getplaces";
import getAPIkey from "../modules/getapikey";

const openPlace = async (context: vscode.ExtensionContext) => {
    const placesArray = await getPlaces(context);

    const places: vscode.QuickPickItem[] = placesArray;

    const selection = await vscode.window.showQuickPick(places, { placeHolder: "Search places" });

    if (selection === undefined) {
        return;
    } else if (selection.label && selection.description) {
        const placeId = selection.description;
        const apiKey = await getAPIkey(context, placeId);
        const gameInfo = getGameInfo(placeId);
        
        const options: vscode.QuickPickItem[] = [
            {
                label: "Edit PlaceId"
            },
            {
                label: "Edit API key"
            },
            {
                label: "Delete place"
            }
        ];

        const action = await vscode.window.showQuickPick(options);

        if (action === undefined) {
            return;
        } else if (action.label === "Edit PlaceId") {
            const newPlaceId = await vscode.window.showInputBox({ placeHolder: placeId });

            if (newPlaceId === undefined) {
                return;
            }

            savePlace(context, false, gameInfo, newPlaceId, apiKey);
        } else if (action.label === "Edit API key") {
            const newAPIkey = await vscode.window.showInputBox({ placeHolder: apiKey });

            if (newAPIkey === undefined) {
                return;
            }

            savePlace(context, false, gameInfo, placeId, newAPIkey);
        } else if (action.label === "Delete place") {
            savePlace(context, true, null, placeId,);
        }
    }
};

export = openPlace;