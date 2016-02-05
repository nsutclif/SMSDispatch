import {Injectable} from 'angular2/core';
import {SMSMessage} from './message';

var MESSAGES: SMSMessage[] = [
    { "id": 1, "text": "Sample Message 1", "date": new Date(), "senderID": 1, "recipientID": 0 },
    { "id": 2, "text": "Sample Message 2", "date": new Date(), "senderID": 2, "recipientID": 0 }
]

@Injectable()
export class MessagesService {
    getMessages() {
        return Promise.resolve(MESSAGES);
    }
}