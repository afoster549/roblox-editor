import * as vscode from "vscode";

const savePlace = (context: vscode.ExtensionContext, gameInfo: any, placeId: string, apiKey: string) => {
    const globalStorageUri = context.globalStorageUri;
    const filePath = vscode.Uri.joinPath(globalStorageUri, "data.json");

    const placeData = {
        "name": gameInfo.name,
        "universeId": String(gameInfo.id),
        "placeId": placeId,
        "apiKey": apiKey
    };

    let data: any;

    vscode.workspace.fs.readFile(filePath).then((rawData) => {
        data = JSON.parse(rawData.toString());

        data[placeData.placeId] = placeData;

        vscode.workspace.fs.writeFile(filePath, Buffer.from(JSON.stringify(data))).then(() => {
            vscode.window.showInformationMessage("Saved place info.");
        });
    });
};

export = savePlace;