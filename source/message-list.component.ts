import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
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
export class MessageListComponent implements OnInit, OnDestroy {
    public messages: SMSMessage[];
    public selectedMessage: SMSMessage;
    
    private messages$: Observable<SMSMessage[]>
    private messageSubscription: Subscription;
    
    onSelect(message: SMSMessage) {
        this.selectedMessage = message;
    }
    
    constructor(private _messagesService: MessagesService) {
        this.messages$ = this._messagesService.messages$;
        this.messageSubscription = this.messages$.subscribe((messages: SMSMessage[]) => {
            this.messages = messages;
        })
    }
    
    ngOnInit() {
        this._messagesService.loadAll();
    }
    
    ngOnDestroy() {
        // prevent memory leak when component destroyed:
        this.messageSubscription.unsubscribe();
    }
}
