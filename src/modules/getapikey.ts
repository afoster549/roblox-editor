import * as vscode from "vscode";

const getAPIkey = (context: vscode.ExtensionContext, placeId: string): any => {
    const globalStorageUri = context.globalStorageUri;
    const filePath = vscode.Uri.joinPath(globalStorageUri, "data.json");

    return vscode.workspace.fs.readFile(filePath).then((rawData) => {
        const data = JSON.parse(rawData.toString());

        return data[placeId].apiKey;
    });
};

export = getAPIkey;