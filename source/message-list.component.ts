import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './sms-message';
import {SMSMessageComponent} from './sms-message.component';
import {MessagesService} from './messages.service';


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
                    [selected]="message === selectedMessage">
                </sms-message>
            </li>
      </ul>
    `,
    directives: [SMSMessageComponent]
})
export class MessageListComponent implements OnInit {
    public messages: SMSMessage[];
    public selectedMessage: SMSMessage;
    
    onSelect(message: SMSMessage) {
        this.selectedMessage = message;
    }
    
    constructor(private _messagesService: MessagesService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._messagesService.getMessages().then(messages => this.messages = messages);
    }
}
