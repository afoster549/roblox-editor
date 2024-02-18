import * as vscode from "vscode";
import axios from "axios";

import TreeItem from "./treeitem";
import TreeDataProvider from "./treedataprovider";

interface EngineInstance {
    name: string;
    id: any;
    details: any;
}

interface Instance {
    engineInstance: EngineInstance;
    hasChildren: any;
    children?: any;
    childrenLoaded: boolean;
    treeItem: TreeItem;
}

interface Instances {
    [key: string]: Instance;
}

let instances: Instances = {};

const treeDataProvider = new TreeDataProvider();
vscode.window.createTreeView("explorer", { treeDataProvider });

const createChildren = async function(context: vscode.ExtensionContext, gameInfo:any, placeId:string, apiKey:string, parentInstance: Instance) {
    const operation = await axios.get(`https://apis.roblox.com/cloud/v2/universes/${gameInfo.id}/places/${placeId}/instances/${parentInstance.engineInstance.id}:listChildren`, {
        headers: {
            "x-api-key": apiKey
        }
    });

    const pollItems = new Promise<any>(async (resolve) => {
        while (true) {
            const result = await axios.get(`https://apis.roblox.com/cloud/v2/${operation.data.path}`, {
                headers: {
                    "x-api-key": apiKey
                }
            });
    
            if (result.status !== 200 || result.data.done) {
                resolve(result.data.response);
    
                break;
            }
        }
    });

    const response = await pollItems;

    response.instances.forEach((element: { engineInstance: { Name: string; Id: any; Details: any; }; hasChildren: any; }) => {
        let script: any;

        if (element.engineInstance.Details.Script !== undefined) {
            script = "Script";
        } else if (element.engineInstance.Details.LocalScript !== undefined) {
            script = "LocalScript";
        } else if (element.engineInstance.Details.ModuleScript !== undefined) {
            script = "ModuleScript";
        } else {
            script = undefined;
        }

        const treeItem = new TreeItem(element.engineInstance.Name, element.hasChildren ? [] : undefined, `icons/instances/${element.engineInstance.Name}.png`, script, false, parentInstance, element);

        treeDataProvider.addChild(parentInstance.treeItem, treeItem);

        parentInstance.children[element.engineInstance.Id] = {
            engineInstance: {
                name: element.engineInstance.Name,
                id: element.engineInstance.Id,
                details: element.engineInstance.Details,
            },
            hasChildren: element.hasChildren,
            children: {},
            childrenLoaded: false,
            treeItem: treeItem
        };

        if (element.hasChildren) {
            const loadChildrenItem = new TreeItem("Load children", undefined, undefined, undefined, true, parentInstance.children[element.engineInstance.Id]);
            treeDataProvider.addChild(treeItem, loadChildrenItem);
        }
    });
};

const createExplorer = async function(context:vscode.ExtensionContext, gameInfo:any, placeId:string, apiKey:string) {
    const operation = await axios.get(`https://apis.roblox.com/cloud/v2/universes/${gameInfo.id}/places/${placeId}/instances/root:listChildren`, {
        headers: {
            "x-api-key": apiKey
        }
    });

    const pollItems = new Promise<any>(async (resolve) => {
        while (true) {
            const result = await axios.get(`https://apis.roblox.com/cloud/v2/${operation.data.path}`, {
                headers: {
                    "x-api-key": apiKey
                }
            });
    
            if (result.status !== 200 || result.data.done) {
                resolve(result.data.response);
    
                break;
            }
        }
    });

    const response = await pollItems;

    const topLevelInstances = [
        "Workspace",
        "Players",
        "Lighting",
        "MaterialService",
        "NetworkClient",
        "ReplicatedFirst",
        "ReplicatedStorage",
        "ServerScriptService",
        "ServerStorage",
        "StarterGui",
        "StarterPack",
        "StarterPlayer",
        "Teams",
        "SoundService",
        "TextChatService"
    ];

    response.instances.forEach((element: { engineInstance: { Name: string; Id: any; Details: any; }; hasChildren: any; }) => {
        if (topLevelInstances.indexOf(element.engineInstance.Name) !== -1) {
            const treeItem = new TreeItem(element.engineInstance.Name, element.hasChildren ? [] : undefined, `icons/instances/${element.engineInstance.Name}.png`, false, true, instances[element.engineInstance.Id]);
            treeDataProvider.addItem(treeItem);

            instances[element.engineInstance.Id] = {
                engineInstance: {
                    name: element.engineInstance.Name,
                    id: element.engineInstance.Id,
                    details: element.engineInstance.Details,
                },
                hasChildren: element.hasChildren,
                children: {},
                childrenLoaded: false,
                treeItem: treeItem
            };

            if (element.hasChildren) {
                const loadChildrenItem = new TreeItem("Load children", undefined, undefined, undefined, true, instances[element.engineInstance.Id]);
                treeDataProvider.addChild(treeItem, loadChildrenItem);
            }
        }
    });

    vscode.commands.registerCommand("roblox-editor.loadChildren", (item, parent) => {
        treeDataProvider.removeChildItem(item);

        createChildren(context, gameInfo, placeId, apiKey, parent);
    });
};

export = createExplorer;