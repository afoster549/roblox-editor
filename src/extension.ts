import * as vscode from "vscode";
import axios from "axios";
import getGameInfo from "./modules/getgameinfo";
import createExplorer from "./modules/createexplorer";

export function activate(context: vscode.ExtensionContext) {
	let gameInfo: any;

	let apiKey = "";
	let placeId = "";

	interface Editors {
		[key: string]: {
			instance: any
			editor: any
			type: string
		}
	}

	let editors:Editors = {};

	let openPlace = vscode.commands.registerCommand("roblox-editor.openPlace", async () => {
		const tempPlaceId = await vscode.window.showInputBox({
			placeHolder: "Place ID"
		});

		if (typeof(tempPlaceId) === "string" && tempPlaceId.length > 0) {
			placeId = tempPlaceId;
		}

		const tempApiKey = await vscode.window.showInputBox({
			placeHolder: "API Key"
		});

		if (typeof(tempApiKey) === "string" && tempApiKey.length > 0) {
			apiKey = tempApiKey;
		}

		vscode.window.showInformationMessage("Loading place");

		const tempGameInfo = await getGameInfo(placeId);

		gameInfo = tempGameInfo;

		createExplorer(context, gameInfo, placeId, apiKey);
	});

	vscode.commands.registerCommand("roblox-editor.openEditor", async (item, instance, script) => {
		const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(`untitled:${instance.engineInstance.Name} - ${script}`));

		await vscode.languages.setTextDocumentLanguage(doc, "lua");

		const editor = await vscode.window.showTextDocument(doc);

		editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0,), instance.engineInstance.Details[script].Source);
		});

		editors[instance.engineInstance.Id] = {
			instance: instance,
			editor: editor,
			type: script
		};
    });

	let saveFile = vscode.commands.registerCommand("roblox-editor.saveFile", async () => {
		const editor = vscode.window.activeTextEditor;

		for (const key in editors) {
			if (editors[key].editor === editor) {
				const type = editors[key].type;

				const response = await axios.patch(`https://apis.roblox.com/cloud/v2/universes/${gameInfo.id}/places/${placeId}/instances/${key}`,
					{
						"engineInstance": {
							"Details": {
								[type]: {
									"Source": editor?.document.getText()
								}
							}
						}
					},
					{
						headers: {
							"x-api-key": apiKey
						}
					}
				);

				while (true) {
					const result = await axios.get(`https://apis.roblox.com/cloud/v2/${response.data.path}`, {
						headers: {
							"x-api-key": apiKey
						}
					});
				
					if (result.status !== 200 || result.data.done) {
						console.log(result);
				
						break;
					}
				}
			}
		}
    });

	let saveAllFiles = vscode.commands.registerCommand("roblox-editor.saveAllFiles", () => {
		let count = 0;

		for (const key in editors) {
			const editor = editors[key].editor;

			setTimeout(async () => {
				const type = editors[key].type;

				const response = await axios.patch(`https://apis.roblox.com/cloud/v2/universes/${gameInfo.id}/places/${placeId}/instances/${key}`,
					{
						"engineInstance": {
							"Details": {
								[type]: {
									"Source": editor?.document.getText()
								}
							}
						}
					},
					{
						headers: {
							"x-api-key": apiKey
						}
					}
				);

				while (true) {
					const result = await axios.get(`https://apis.roblox.com/cloud/v2/${response.data.path}`, {
						headers: {
							"x-api-key": apiKey
						}
					});
				
					if (result.status !== 200 || result.data.done) {
						console.log(result);
				
						break;
					}
				}
			}, count * 1000);

			count ++;
		}
    });

	context.subscriptions.push(openPlace);
	context.subscriptions.push(saveFile);
	context.subscriptions.push(saveAllFiles);
}

export function deactivate() {}
