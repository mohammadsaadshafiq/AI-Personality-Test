import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

interface ChatMessage {
  role: string;
  content: string;
}

interface Personality {
  [key: string]: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  chatHistory: ChatMessage[] = [];
  userInput = '';
  data: Object;
  response: any;
  chatResponse: any;
  apiKey = '2q36pdENdgZk8k03v69CT3BlbkFJeYFzDSR0K9blE1b23Wru';
  loading = false; // New loading state variable

  constructor(public analyticsService: AnalyticsService) {}

  ngOnInit(): void {}

  questions = [
    "I find it difficult to introduce myself to people.",
    "I often feel energized and excited when I am in a large social gathering.",
    "It is important for me to have a well-organized and structured environment.",
    "I find it difficult to be cool and aloof when something went wrong.",
    "It is important for me to go to outings and be sociable."
  ];

  answers: string[] = [];

  submitAnswers() {
    const payload = {};

    let result = '';
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const answer = this.answers[i];

      result += `${answer} ${question}. `;
    }

    this.data = [
      {
        id: '1',
        language: 'en',
        text: result.trim() // Trim to remove any trailing whitespace
      }
    ];

    console.log(this.data);
    this.loading = true; // Set loading state to true
    this.analyticsService.addCampaign(this.data).subscribe(
      (response: any) => {
        this.response = response;
        let finalresponse = this.extractPersonalities(this.response);

        let Response = JSON.stringify(finalresponse).replace(/[{}\/:\\]/g, '');
        let obj = {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a person with the following personality traits:"
            },
            {
              role: "user",
              content:
                "Based on my personality score, generate a short description with only important values to show this in a readable format and write 100 words about my personality" +
                Response
            }
          ]
        };
        this.sendUserMessage(obj);
        setTimeout(() => {
          this.loading = false; // Set loading state to false after 4 seconds
        }, 13000);
      },
      (error) => {
        console.error(error);
        // Handle errors
        this.loading = false; // Set loading state to false
      }
    );
  }

  extractPersonalities(response: any): Personality {
    const personalities: Personality = {};

    for (const key in response[0]) {
      if (key !== "id" && key !== "__proto__") {
        personalities[key] = response[0][key];
      }
    }

    return personalities;
  }

  sendUserMessage(body?: any) {
    debugger;
    const userMessage = this.userInput.trim();
    let obj = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a personality guide, write only 100 words"
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    };
    if (userMessage || body) {
      this.chatHistory.push({ role: "user", content: userMessage });
      this.userInput = "";

      try {
        this.loading = true; // Set loading state to true
        this.analyticsService.generateResponse(body || obj).subscribe(
          (response: any) => {
            const assistantResponse = response.choices[0].message.content;
            this.chatHistory.push({ role: "assistant", content: assistantResponse });
            setTimeout(() => {
              this.loading = false; // Set loading state to false after 4 seconds
            }, 4000);
          },
          (error) => {
            console.error(error);
            // Handle errors
            this.loading = false; // Set loading state to false
          }
        );
      } catch (error) {
        console.error(error);
        // Handle errors
        this.loading = false; // Set loading state to false
      }
    }
  }
}
