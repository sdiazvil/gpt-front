import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGPTService {
  url = 'http://localhost:8000/completions';

  constructor(private http: HttpClient) {

  }

  getCompletions(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { prompt };
    return this.http.post<any>(this.url, body, {headers});
  }

}
