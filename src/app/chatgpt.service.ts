import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGPTService {
  // private openai: OpenAIApi;

  url = 'http://localhost:8000/completions';

  constructor(private http: HttpClient) {
    // delete this.configuration.baseOptions.headers['User-Agent'];
    // this.openai = new OpenAIApi(this.configuration);
  }

  getCompletions(prompt: string): Observable<any> {
    const body = { prompt:prompt };
    return this.http.post(this.url, body);
  }

}
