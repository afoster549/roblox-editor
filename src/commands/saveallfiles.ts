import * as vscode from "vscode";
import axios from "axios";

const saveFile = async (gameInfo: any, apiKey: string, placeId: string, editors: any) => {
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
                    break;
                }
            }
        }, count * 1000);

        count++;
    }
};

export = saveFile;