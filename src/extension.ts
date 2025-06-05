import * as vscode from 'vscode';
import { DeepSeekChatProvider } from './DeepSeekChatProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new DeepSeekChatProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('chatView', provider)
  );
}

export function deactivate() {}
