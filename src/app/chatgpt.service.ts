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

  // generateText(prompt: string): Promise<string | undefined> {
  //   return this.openai.createCompletion({
  //     model: "text-davinci-003",
  //     prompt: prompt,
  //     max_tokens: 56
  //     //max_tokens: 256
  //   }).then(response => {
  //     return response.data.choices[0].text;
  //   }).catch(error => {
  //     return '';
  //   });
  // }

  async generateTextByAPI(prompt: string): Promise<any> {
    try {
      const response = await this.http.post(this.url, { prompt: prompt }).toPromise();
      // console.log(response); // Maneja la respuesta aquí
      return response;
    } catch (error) {
      console.error(error); // Maneja el error si la petición falla
    }
  }

  getCompletions(prompt: string) {
    return this.http.post(this.url, { prompt }, { responseType: 'text' });
  }

  getCompletionsStream(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.url, { prompt }, { headers, responseType: 'text' });
  }

}
