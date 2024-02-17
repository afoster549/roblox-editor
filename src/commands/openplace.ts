import * as vscode from "vscode";

import createExplorer from "../modules/createexplorer";
import savePlace from "../modules/saveplace";
import getGameInfo from "../modules/getgameinfo";
import getPlaces from "../modules/getplaces";
import getAPIkey from "../modules/getapikey";

const openPlace = async (context: vscode.ExtensionContext) => {
    let gameInfo: any;
	let apiKey = "";
	let placeId = "";

    const placesArray = await getPlaces(context);
    placesArray.push({
        label: "Add place",
        description: "Add a new place"
    });

    const places: vscode.QuickPickItem[] = placesArray;

    const selection = await vscode.window.showQuickPick(places, { placeHolder: "Search places" });

    if (selection === undefined) {
        return;
    } else if (selection.label === "Add place" && selection.description === "Add a new place") {
        const tempPlaceId = await vscode.window.showInputBox({
            placeHolder: "Place ID"
        });

        if (typeof (tempPlaceId) === "string" && tempPlaceId.length > 0) {
            placeId = tempPlaceId;
        } else {
            return;
        }

        const tempApiKey = await vscode.window.showInputBox({
            placeHolder: "API Key"
        });

        if (typeof (tempApiKey) === "string" && tempApiKey.length > 0) {
            apiKey = tempApiKey;
        } else {
            return;
        }

        gameInfo = await getGameInfo(placeId);

        savePlace(context, false, gameInfo, placeId, apiKey);
    } else if (selection.label && selection.description) {
        placeId = selection.description;
        apiKey = await getAPIkey(context, placeId);
    }

    if (gameInfo === undefined) {
        gameInfo = await getGameInfo(placeId);
    }

    vscode.window.showInformationMessage("Loading place");

    createExplorer(context, gameInfo, placeId, apiKey);

    return {
        gameInfo: gameInfo,
        apiKey: apiKey,
        placeId: placeId
    };
};

export = openPlace;