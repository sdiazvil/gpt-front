import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatGPTService } from '../chatgpt.service';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

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
  //messages: string[] = [];
  private socket$: WebSocketSubject<any> | undefined;
  promptText: string = ''; // Variable para almacenar el prompt ingresado por el usuario
  assistantResponse = '';


  //

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  messages: Message[] = [];
  newMessageText = '';
  loading = false;

  constructor(private openaiService: ChatGPTService) { }

  ngOnInit() {
    this.socket$ = webSocket('ws://localhost:8000/completions'); // Reemplaza la URL con la dirección de tu servidor WebSocket
  
    // Observador para recibir datos del servidor
    this.socket$.subscribe(
      (message: any) => {
        try {
          const data = message
          //console.log(message)
          if (data.message) {
            // const responseMessage: Message = {
            //   text:  data.message,
            //   incoming: true
            // };
            // this.messages.push(responseMessage);
            this.assistantResponse += data.message;
            this.scrollToBottom();
            // this.messages.push(data.message);
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
    if (this.newMessageText.trim() !== '') {
      let newMessage: Message = {
        text: this.newMessageText,
        incoming: false
      };
      this.messages.push(newMessage);

      let prompt = this.newMessageText;

      this.newMessageText = '';

      try {
        this.loading = true;
        this.sendPrompt(prompt);
      } catch (error) {
        console.error(error);
        this.loading = false;
        throw error;
      }

      this.loading = false;
      this.scrollToBottom();
    }
  }

   // Función para enviar el prompt al servidor
   sendPrompt(prompt:any) {
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