import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  Url="https://big-five-personality-insights.p.rapidapi.com/api/big5";
  allAnswers=null;
  constructor(private http: HttpClient) { }
  addCampaign(data:any) {
    const headerDict = {
      'Content-Type': "application/json",
      // 'X-RapidAPI-Key': "72e929e899mshb9c35f7f7711b28p142184jsnbc65c2829eb2",
      'X-RapidAPI-Key': 'ca3561344amsh13623bdcd3eb599p146160jsnf77992a9f231',
      'X-RapidAPI-Host': "big-five-personality-insights.p.rapidapi.com"
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.post(this.Url,data,requestOptions )
  }
  generateResponse(body:string) {
    const apiKey = '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';
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    try {
     return this.http.post('https://api.openai.com/v1/chat/completions', JSON.stringify(body), requestOptions);

      // Handle the response as desired
    } catch (error) {
      console.error(error);
      // Handle errors
    }
  }
}