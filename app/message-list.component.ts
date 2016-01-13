import {Component} from 'angular2/core';
import {SMSMessage} from './sms-message';
import {SMSMessageComponent} from './sms-message.component';
import {ContactGroup} from './contact';

var MESSAGES: SMSMessage[] = [
    { "id": 1, "text": "Sample Message 1", "date": new Date(), "senderID": 1, "recipientID": 0 },
    { "id": 2, "text": "Sample Message 2", "date": new Date(), "senderID": 2, "recipientID": 0 }
]

var CONTACT_GROUPS: ContactGroup[] = [
    {"id": 1, "name": "Organizers", "contacts": [
        {"id": 1, "name": "Terry", "phone": "555-555-1111"},
        {"id": 2, "name": "Mary", "phone": "555-555-1112"}
        ]},
    {"id": 1, "name": "Volunteers", "contacts": [
        {"id": 3, "name": "Bary", "phone": "555-555-1113"},
        {"id": 4, "name": "Perry", "phone": "555-555-1114"},
        {"id": 5, "name": "Carry", "phone": "555-555-1115"},
        {"id": 6, "name": "Fairy", "phone": "555-555-1116"},
        {"id": 7, "name": "Harry", "phone": "555-555-1117"},
        {"id": 8, "name": "Sherry", "phone": "555-555-1118"},
        {"id": 9, "name": "Lary", "phone": "555-555-1119"}
        ]}
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
    directives: [SMSMessageComponent]
})
export class MessageListComponent {
    public messages = MESSAGES;
    public selectedMessage: SMSMessage;
    public contactGroups: ContactGroup[] = CONTACT_GROUPS;
    
    onSelect(message: SMSMessage) {
        this.selectedMessage = message;
    }
}
