import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {SMSMessage} from './message';
import {ContactsService} from './contacts.service';

// HTTP polling example:
// http://chariotsolutions.com/blog/post/angular2-observables-http-separating-services-components/
// Also useful:
// http://www.syntaxsuccess.com/viewarticle/angular-2.0-and-http
// All in on observables:
// https://coryrylan.com/blog/angular-2-observable-data-services

const BASE_API_URL: string = 'https://pn52ql1d48.execute-api.us-east-1.amazonaws.com/prod';
const MESSAGES_URL: string = BASE_API_URL + '/messages';
const OUTGOING_MESSAGES_URL: string = MESSAGES_URL + '/outgoing';

const MESSAGES_PER_CALL = 100;
const POLLING_INTERVAL = 10 * 1000;

@Injectable()
export class MessagesService {
    messages$: Observable<SMSMessage[]>;
    private _messagesObserver: Observer<SMSMessage[]>;
    private _dataStore :{
        messages: SMSMessage[];
    }
    
    constructor (private _http: Http, private _contactsService: ContactsService) {
        this._dataStore = {messages: []};
        this.messages$ = new Observable<SMSMessage[]>((observer)=> {
            this._messagesObserver = observer;
        }).share();
    }
    
    public loadAll() {
        // TODO: Use hypermedia style of pagination on the server side.
        let requestURL = MESSAGES_URL + '?Skip=' + this._dataStore.messages.length + '&Limit=' + MESSAGES_PER_CALL;
        let subscription = this._http.get(requestURL)
          .subscribe((response: Response) => {
              let dtoMessages: any[] = response.json();
              if (!Array.isArray(dtoMessages)) {
                  console.log('response.json is not an array: ' + JSON.stringify(response.json()));
                  dtoMessages = [];
              }

              dtoMessages.map(dtoMessage => {
                //   console.log(JSON.stringify(dtoMessage));
                  this._dataStore.messages.unshift({
                      id: dtoMessage.id,
                      text: dtoMessage.body,
                      date: new Date(dtoMessage.messagesortkey), // Currently the messagesortkey is the date...
                      to: dtoMessage.to,
                      from: dtoMessage.from,
                      outgoing: dtoMessage.direction === 'outbound-api',
                      contact: null
                  });
              });
              
              this._messagesObserver.next(this._dataStore.messages);
              
              // TODO: Stop using recursion here
              // http://stackoverflow.com/questions/35254323/rxjs-observable-pagination
              
              console.log('Messages: ' + dtoMessages.length);
              
              if(dtoMessages.length > 0) {
                  this.loadAll();
              } else {
                  // TODO: Stop doing this.
                  // http://chariotsolutions.com/blog/post/angular2-observables-http-separating-services-components/
                  setTimeout(this.loadAll.bind(this), POLLING_INTERVAL);
              }
          }, (error) => {
              console.log('Eror loading messages: ' + error);
          })
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
    
    public sendMessage(message: SMSMessage): Observable<any> {
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
        
        return this._http.post(OUTGOING_MESSAGES_URL, body, options)
                 .map(this.extractSendResponse)
                 .catch(this.handleSendMessageError);
    }
    
    public sendMessages(message: SMSMessage, recipients: string[]): Observable<any> {
        try {
            recipients = recipients.map((recipient) => {
                // fix up and check the recipients.
                let numbersOnly = this._contactsService.stripPhoneNumber(recipient);
                
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