import * as vscode from "vscode";
import axios from "axios";

import openPlace from "./commands/openplace";
import openEditor from "./commands/openeditor";
import saveFile from "./commands/savefile";
import saveAllFiles from "./commands/saveallfiles";

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

	let openPlaceCmd = vscode.commands.registerCommand("roblox-editor.openPlace", async () => {
		const response = await openPlace(context);

		if (response) {
			gameInfo = response.gameInfo;
			apiKey = response.apiKey;
			placeId = response.placeId;
		}
	});

	vscode.commands.registerCommand("roblox-editor.openEditor", async (_, instance, script) => {
		const response = await openEditor(instance, script, editors);
		editors = response.editors;

		context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
			if (response.editor.document.isClosed) {
			  	delete editors[response.key];
			}
		  }));
    });

	let saveFileCmd = vscode.commands.registerCommand("roblox-editor.saveFile", async () => {
		saveFile(gameInfo, apiKey, placeId, editors);
    });

	let saveAllFilesCmd = vscode.commands.registerCommand("roblox-editor.saveAllFiles", () => {
		saveAllFiles(gameInfo, apiKey, placeId, editors);
    });

	context.subscriptions.push(openPlaceCmd);
	context.subscriptions.push(saveFileCmd);
	context.subscriptions.push(saveAllFilesCmd);
}

export function deactivate() {}
