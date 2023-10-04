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
  messages: string[] = [];
  private socket$: WebSocketSubject<any> | undefined;
  promptText: string = ''; // Variable para almacenar el prompt ingresado por el usuario
  assistantResponse = '';

  constructor(private openaiService: ChatGPTService) { }

  // ngOnInit() {
  //   const prompt = 'Hola'; // Reemplaza con tu prompt real

  //   this.openaiService.getCompletions(prompt).subscribe(
  //     (message: string) => {
  //       this.messages.push(message);
  //     },
  //     (error) => {
  //       console.error('Error en la solicitud:', error);
  //     }
  //   );
  // }

  ngOnInit() {
    this.socket$ = webSocket('ws://localhost:8000/completions'); // Reemplaza la URL con la dirección de tu servidor WebSocket
  
    // Observador para recibir datos del servidor
    this.socket$.subscribe(
      (message: any) => {
        try {
          const data = message
          console.log(message)
          if (data.message) {
            this.assistantResponse += data.message + ' ';
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

   // Función para enviar el prompt al servidor
   sendPrompt() {
    if (this.socket$) {
      this.socket$.next({ prompt: this.promptText });
    }
  }
}
