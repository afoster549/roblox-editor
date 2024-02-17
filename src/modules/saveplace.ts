import * as vscode from "vscode";

const savePlace = (context: vscode.ExtensionContext, remove: boolean, gameInfo?: any, placeId?: string, apiKey?: string) => {
    const globalStorageUri = context.globalStorageUri;
    const filePath = vscode.Uri.joinPath(globalStorageUri, "data.json");

    let data: any;

    vscode.workspace.fs.readFile(filePath).then((rawData) => {
        data = JSON.parse(rawData.toString());

        if (remove === false && placeId) {
            console.log("huh");

            const placeData = {
                "name": gameInfo.name,
                "universeId": String(gameInfo.id),
                "placeId": placeId,
                "apiKey": apiKey
            };

            data[placeId] = placeData;
        } else if (remove && placeId) {
            console.log("wat");

            delete data[placeId];
        }

        vscode.workspace.fs.writeFile(filePath, Buffer.from(JSON.stringify(data))).then(() => {
            console.log(filePath);

            vscode.window.showInformationMessage("Saved place info.");
        });
    });
};

export = savePlace;