import * as vscode from "vscode";

const openEditor = async (instance: any, script: string, editors: any) => {
    if (editors[instance.engineInstance.Id] !== undefined) {
        return;
    }

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

    return {
        editors: editors,
        editor: editor,
        key: instance.engineInstance.Id
    };
};

export = openEditor;