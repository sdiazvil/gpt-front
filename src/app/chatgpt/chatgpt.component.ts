import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

export class textResponse {
  sno: number = 1;
  text: string = '';
  response: any = '';
}

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.css']
})
export class ChatgptComponent implements OnInit {
  private socket$: WebSocketSubject<any> | undefined;
  assistantResponse = '';
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  messages: Message[] = [];
  newMessageText = '';
  activateResponse = false;
  websocket_url = environment.websocket;
  constructor() { }

  ngOnInit() {
    this.socket$ = webSocket(this.websocket_url); // Reemplaza la URL con la dirección de tu servidor WebSocket

    // Observador para recibir datos del servidor
    this.socket$.subscribe(
      (message: any) => {
        try {
          const data = message
          this.activateResponse = true;
          if (data.message) {
            this.assistantResponse += data.message;
            this.scrollToBottom();
          }
        } catch (e) {
          console.error('Error al analizar el mensaje JSON', e);
        }
      },
      (error) => {
        console.error('Error en la conexión WebSocket', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.socket$) {
      this.socket$.complete(); // Cierra la conexión WebSocket
    }
  }

  async sendMessage() {
    if (this.activateResponse) {
      this.messages.push({ text: this.assistantResponse, incoming: true });
      this.activateResponse = false;
      this.assistantResponse = '';
    }
    if (this.newMessageText.trim() !== '') {
      let newMessage: Message = {
        text: this.newMessageText,
        incoming: false
      };
      this.messages.push(newMessage);

      let prompt = this.newMessageText;

      this.newMessageText = '';

      try {
        this.sendPrompt(prompt);
      } catch (error) {
        console.error(error);
        throw error;
      }

      this.scrollToBottom();
    }
  }

  // Función para enviar el prompt al servidor
  sendPrompt(prompt: any) {
    if (this.socket$) {
      this.socket$.next({ prompt: prompt });
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    });
  }
}


interface Message {
  text: string;
  incoming: boolean;
}