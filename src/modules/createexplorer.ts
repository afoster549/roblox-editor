import * as vscode from "vscode";
import axios from "axios";

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

function findKey(object: { [key: string]: any }, key: string): any | null {
    for (const prop in object) {
        if (prop === key) {
            return object[prop];
        } else if (typeof object[prop] === "object") {
            const result = findKey(object[prop], key);

            if (result) {
                return result;
            }
        }
    }

    return null;
}

class TreeItem extends vscode.TreeItem {
    children: TreeItem[] = [];

    constructor(lable: string, children?: TreeItem[], script?: any, loadBtn?: boolean, parent?: Instance, instance?: Object) {
        super(
            lable,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed
        );

        if (loadBtn && parent) {
            this.command = {
                command: "roblox-editor.loadChildren",
                title: "Load Children",
                arguments: [
                    this,
                    parent
                ]
            };
        } else if (script && parent && instance) {
            this.command = {
                command: "roblox-editor.openEditor",
                title: "Open Editor",
                arguments: [
                    this,
                    instance,
                    script
                ]
            };
        }
    }
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private data: TreeItem[] = [];

    constructor() {}

    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (element) {
            return Promise.resolve(element.children);
        } else {
            return Promise.resolve(this.data);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    addItem(item: TreeItem): void {
        this.data.push(item);
        this.refresh();
    }

    addChild(parent: TreeItem, child: TreeItem): void {
        parent.children.push(child);
        this.refresh();
    }

    removeItem(item: TreeItem): void {
        const index = this.data.indexOf(item);

        if (index !== -1) {
            this.data.splice(index, 1);
        }

        this.refresh();
    }

    removeChildItem(childItem: TreeItem): void {
        const parentItem = this.getParentItem(childItem);

        if (!parentItem) {
            return;
        }

        const index = parentItem.children.indexOf(childItem);

        if (index !== -1) {
            parentItem.children.splice(index, 1);
        }

        this.refresh();
    }

    getParentItem(childItem: TreeItem): TreeItem | undefined {
        for (const item of this.data) {
            if (item.children.includes(childItem)) {
                return item;
            }

            const parent = this.findParentItem(childItem, item);

            if (parent) {
                return parent;
            }
        }

        return undefined;
    }

    findParentItem(childItem: TreeItem, item: TreeItem): TreeItem | undefined {
        for (const child of item.children) {
            if (child === childItem) {
                return item;
            }

            const parent = this.findParentItem(childItem, child);
            
            if (parent) {
                return parent;
            }
        }

        return undefined;
    }
}

const treeDataProvider = new TreeDataProvider();
vscode.window.createTreeView("explorer", { treeDataProvider });

const createChildren = async function(context:vscode.ExtensionContext, gameInfo:any, placeId:string, apiKey:string, parentInstance: Instance) {
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

        const treeItem = new TreeItem(element.engineInstance.Name, element.hasChildren ? [] : undefined, script, false, parentInstance, element);

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
            const loadChildrenItem = new TreeItem("Load children", undefined, false, true, parentInstance.children[element.engineInstance.Id]);
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
            const treeItem = new TreeItem(element.engineInstance.Name, element.hasChildren ? [] : undefined);
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
                const loadChildrenItem = new TreeItem("Load children", undefined, false, true, instances[element.engineInstance.Id]);
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