import * as vscode from "vscode";
import axios, { get } from "axios";

const getGameInfo = function(placeId: String): Object {
	return new Promise(function(resolve, reject) {
		axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
		.then((response) => {
			const universeId = response.data.universeId;

			axios.get('https://games.roblox.com/v1/games?universeIds=' + universeId)
			.then((response) => {
				resolve(response.data.data[0]);
			})
			.catch(() => {
				vscode.window.showInformationMessage(`Failed to open game ${universeId}`);
				
				reject({});
			});
		})
		.catch(() => {
			vscode.window.showInformationMessage(`Failed to find place ${placeId}`);

			reject({});
		});
	});
};

export = getGameInfo;