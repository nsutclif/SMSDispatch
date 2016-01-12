import {Component} from 'angular2/core';
import {SMSMessage} from './sms-message';
import {SMSMessageComponent} from './sms-message.component';
import {ContactGroup} from './contact';

var MESSAGES: SMSMessage[] = [
    { "id": 1, "text": "Sample Message 1", "date": new Date(), "senderID": 1, "recipientID": 0 },
    { "id": 2, "text": "Sample Message 2", "date": new Date(), "senderID": 2, "recipientID": 0 }
]


@Component({
    selector: 'message-list',
    template:`
        <ul class="list-group">
            <li *ngFor="#message of messages" 
                class="list-group-item"
                [class.active]="message === selectedMessage"
                (click)="onSelect(message)">
                <sms-message 
                    [message]="message" 
                    [selected]="message === selectedMessage"
                    [contactGroups]="contactGroups">
                </sms-message>
            </li>
      </ul>
    `,
    directives: [SMSMessageComponent],
    inputs: ['contactGroups']
})
export class MessageListComponent {
    public messages = MESSAGES;
    public selectedMessage: SMSMessage;
    public contactGroups: ContactGroup[];
    
    onSelect(message: SMSMessage) {
        this.selectedMessage = message;
    }
}
