import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatGPTService } from '../chatgpt.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  words$ = new BehaviorSubject<string[]>([]);


  constructor(private completionService: ChatGPTService, private cdr: ChangeDetectorRef // Importa ChangeDetectorRef
  ) { }

  ngOnInit() {
    const prompt = 'dime 10 ideas de negocio'; // Reemplaza con tu prompt real

    this.completionService.getCompletions(prompt).subscribe(
      (response: any) => {
        console.log(response)
        console.log(response.choices[0].message.content)
        if (response.choices) {
          const content = response.choices[0].message.content;
          console.log(content)
          if (content) {
            const newWords = content.trim().split(' ');
            this.words$.next([...this.words$.value, ...newWords]);
          }
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

}
