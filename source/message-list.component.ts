import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SMSMessage} from './message';
import {SMSMessageComponent} from './message.component';
import {MessagesService} from './messages.service';
import {MessageSendFormComponent} from './message-send-form.component';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'message-list',
    template:`
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <button type="button" class="btn btn-default navbar-btn" aria-label="Left Align" (click)="sending=true" *ngIf="!sending">
                    Send...
                </button>
                <message-send-form (done)="sending=false" *ngIf="sending"></message-send-form>
            </div>
        </nav>
        <div *ngFor="let message of messages">
            <sms-message 
                (click)="onSelect(message)"
                [message]="message">
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
    
    public sending: boolean;
    
    onSelect(message: SMSMessage) {
        this.selectedMessage = message;
    }
    
    constructor(private _messagesService: MessagesService, private _contactsService: ContactsService) {
        this.messages$ = this._messagesService.messages$;
        this.messageSubscription = this.messages$.subscribe((messages: SMSMessage[]) => {
            this.messages = messages;
            this.messages.map((message) => {
                // make sure all the messages have contacts.
                if (!message.contact) {
                    if (message.outgoing) {
                        message.contact = this._contactsService.getContactByPhoneApprox(message.to);
                    } else {
                        message.contact = this._contactsService.getContactByPhoneApprox(message.from);
                    }
                }
            });
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
