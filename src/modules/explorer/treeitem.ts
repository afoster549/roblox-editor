import * as vscode from "vscode";
import path from "path";

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

class TreeItem extends vscode.TreeItem {
    children: TreeItem[] = [];

    constructor(lable: string, children?: TreeItem[], icon?: string, script?: any, loadBtn?: boolean, parent?: Instance, instance?: Object) {
        super(
            lable,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed
        );

        if (script) {
            this.iconPath = {
                light: path.join(__dirname, "..", "..", "icons", "instances", script + ".png"),
                dark: path.join(__dirname, "..", "..", "icons", "instances", script + ".png")
            };

        } else if (icon) {
            this.iconPath = {
                light: path.join(__dirname, "..", "..", icon),
                dark: path.join(__dirname, "..", "..", icon)
            };

            console.log(this.iconPath);
        }

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

export = TreeItem;