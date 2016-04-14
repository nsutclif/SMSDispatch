import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {SMSMessageComponent} from './message.component';
import {MessagesService} from './messages.service';
import {MessageSendFormComponent} from './message-send-form.component';

@Component({
    selector: 'message-list',
    template:`
        <message-send-form></message-send-form>
        <div *ngFor="#message of messages">
            <sms-message 
                (click)="onSelect(message)"
                [message]="message" 
                [selected]="message === selectedMessage">
            </sms-message>
        </div>
    `,
    directives: [SMSMessageComponent, MessageSendFormComponent]
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
