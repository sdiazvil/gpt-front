import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatGPTService } from '../chatgpt.service';
import { Observable } from 'rxjs';

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
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

 messages: Message[] = [];
 newMessageText = '';
loading = false;

  constructor(private openaiService: ChatGPTService) {}

  ngOnInit(): void {
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
        this.getCompletionsStream(prompt);
      } catch (error) {
        console.error(error);
        this.loading = false;
        throw error;
      }

      this.loading = false;
      this.scrollToBottom();
    }
  }

  private getCompletionsStream(prompt: string) {
    this.openaiService.getCompletionsStream(prompt).subscribe(
      (response: any) => {
        console.log(response)
        const responseMessage: Message = {
          text: response,
          incoming: true
        };
        this.messages.push(responseMessage);
        this.scrollToBottom();
      },
      (error) => {
        console.error('Error al obtener la transmisión:', error);
      }
    );
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