import * as vscode from "vscode";
import TreeItem from "./treeitem";

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

export = TreeDataProvider;