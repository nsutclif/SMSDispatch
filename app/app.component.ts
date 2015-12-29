import {Component} from 'angular2/core';

interface SMSMessage {
    text: string;
}
@Component({
    selector: 'my-app',
    template:`
      <html>
      <head>
      <title>{{title}}</title>
      </head>
      <body>
      <h1>{{title}}</h1>
      <h2>{{message.text}}</h2>
      </body>
      </html>
    `
})
export class AppComponent {
    public title = 'SMS Dispatch';
    public message: SMSMessage = {
       text: 'Sample Message' 
    }
}
