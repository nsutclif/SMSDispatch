import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {SMSMessage} from './message';

var MESSAGES: SMSMessage[] = [
    { "id": 1, "text": "Sample Message 1", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 2, "text": "Sample Message 2", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 3, "text": "Sample Message 3", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 4, "text": "Sample Message 4", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 5, "text": "Sample Message 5", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 6, "text": "Sample Message 6", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 7, "text": "Sample Reply 7", "date": new Date(), "to": "+7788251056", "from": "+7787710823" },
    { "id": 8, "text": "Sample Reply 8", "date": new Date(), "to": "+7788251056", "from": "+7787710823" },
    { "id": 9, "text": "Sample Reply 9", "date": new Date(), "to": "+7788251056", "from": "+7787710823" },
    { "id": 10, "text": "Sample Message 10", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 11, "text": "Sample Message 11", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 12, "text": "Sample Message 12", "date": new Date(), "to": "+7787710823", "from": "+7788251056" },
    { "id": 13, "text": "Sample Message 13", "date": new Date(), "to": "+7787710823", "from": "+7788251056" }
]

const BASE_API_URL: string = 'https://pn52ql1d48.execute-api.us-east-1.amazonaws.com/prod/';
const OUTGOING_MESSAGES_URL: string = BASE_API_URL + 'messages/outgoing/';

@Injectable()
export class MessagesService {
    constructor (private http: Http) {
    }
    
    public getMessages() {
        return Promise.resolve(MESSAGES);
    }
    
    private extractSendResponse(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        console.log(res);
        let body = res.json();
        
        if ((body) && (body.errorMessage)) {
            throw new Error(body.errorMessage);
        }
        
        return body || { };
    }
    
    private handleSendMessageError(error: any) {
        let errorMessage = error.message || 'Server error';
        console.log('Error sending message: ' + errorMessage);
        return Observable.throw(errorMessage);
    }
    
    public sendMessage(message: SMSMessage): Observable<SMSMessage> {
        let body = JSON.stringify({
            message: {
                to: message.to,
                body: message.text
            }
        });
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers: headers
        });
        
        console.log('about to post: ' + body);
        console.log('to: ' + OUTGOING_MESSAGES_URL);
        
        return this.http.post(OUTGOING_MESSAGES_URL, body, options)
                 .map(this.extractSendResponse)
                 .catch(this.handleSendMessageError);
    }
    
    public sendMessages(message: SMSMessage, recipients: string[]): Observable<SMSMessage> {
        try {
            recipients = recipients.map((recipient) => {
                // fix up and check the recipients.
                let numbersOnly = recipient.replace(/[^0-9]+/g, '');
                
                if (numbersOnly.length < 10) {
                    throw new Error('Recipient ' + recipient + ' needs to have at least 10 digits');
                }
                
                return recipient;
            });
            
            return Observable.forkJoin(recipients.map((recipient) => {
                message.to = recipient;
                return this.sendMessage(message);
            }));            
        } 
        catch (error) {
            return Observable.throw(error);
        }
    }
}