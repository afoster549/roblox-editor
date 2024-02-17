import * as vscode from "vscode";
import axios from "axios";

const saveFile = async (gameInfo: any, apiKey: string, placeId: string, editors: any) => {
    const editor = vscode.window.activeTextEditor;

    for (const key in editors) {
        if (editors[key].editor === editor) {
            const type = editors[key].type;
            const data = {
                "engineInstance": {
                    "Details": {
                        [type]: {
                            "Source": editor?.document.getText()
                        }
                    }
                }
            };

            const response = await axios.patch(`https://apis.roblox.com/cloud/v2/universes/${gameInfo.id}/places/${placeId}/instances/${key}`,
                data,
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
                    break;
                }
            }
        }
    }
};

export = saveFile;