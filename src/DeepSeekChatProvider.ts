import * as vscode from 'vscode';

export class DeepSeekChatProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'sendMessage') {
        const userText = message.text;

        // Aqui você chama a API do Ollama local (ainda simulada)
        const responseText = await this.callOllamaAPI(userText);

        // Envia resposta de volta pra webview
        this.sendMessageResponse(responseText);
      }
    });
  }

  private async callOllamaAPI(userText: string): Promise<string> {
    // TODO: substitua aqui pela chamada real ao Ollama ou DeepSeek local
    // Exemplo fictício que só retorna o texto recebido:
    return `Resposta simulada do Ollama: ${userText}`;
  }

  public sendMessageResponse(text: string) {
    this._view?.webview.postMessage({ command: 'receiveMessage', text });
  }

  private getHtmlForWebview(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>DeepSeek Chat</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0; padding: 10px;
          display: flex; flex-direction: column; height: 100vh;
        }
        #messages {
          flex-grow: 1;
          overflow-y: auto;
          border: 1px solid #ddd;
          padding: 10px;
          margin-bottom: 10px;
          background: #f5f5f5;
        }
        #inputArea {
          display: flex;
        }
        input[type="text"] {
          flex-grow: 1;
          padding: 8px;
          font-size: 1em;
        }
        button {
          padding: 8px 12px;
          font-size: 1em;
        }
      </style>
    </head>
    <body>
      <div id="messages"></div>
      <div id="inputArea">
        <input type="text" id="input" placeholder="Digite sua mensagem..." />
        <button id="send">Enviar</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        const messages = document.getElementById('messages');
        const input = document.getElementById('input');
        const sendBtn = document.getElementById('send');

        function addMessage(text, isUser) {
          const div = document.createElement('div');
          div.textContent = text;
          div.style.marginBottom = '8px';
          div.style.textAlign = isUser ? 'right' : 'left';
          div.style.fontWeight = isUser ? 'bold' : 'normal';
          messages.appendChild(div);
          messages.scrollTop = messages.scrollHeight;
        }

        sendBtn.addEventListener('click', () => {
          const text = input.value.trim();
          if (!text) return;
          addMessage(text, true);
          vscode.postMessage({ command: 'sendMessage', text });
          input.value = '';
        });

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'receiveMessage') {
            addMessage(message.text, false);
          }
        });
      </script>
    </body>
    </html>`;
  }
}
