import * as vscode from "vscode";

const getPlaces = (context: vscode.ExtensionContext): any => {
    const globalStorageUri = context.globalStorageUri;
    const filePath = vscode.Uri.joinPath(globalStorageUri, "data.json");

    return vscode.workspace.fs.readFile(filePath).then((rawData) => {
        const data = JSON.parse(rawData.toString());
		const placesKeys = Object.keys(data);

        let places = [];

        for (const key of placesKeys) {
            const place = data[key];
    
            places.push({
                label: place.name,
                description: place.placeId
            });
        }

        return places;
    });
};

export = getPlaces;