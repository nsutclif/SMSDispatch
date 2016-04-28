import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';
import {Contact, ContactGroup} from './contact'; 
import {ContactsService} from './contacts.service';
import {MessageSendFormComponent} from './message-send-form.component';

@Component({
    selector: 'sms-message',
    template:`
        <div class="message">
            <div class="container-fluid">
                <div class="row" *ngIf="message.outgoing">
                    <div class="col-md-2">
                    </div>
                    <div class="col-md-10">
                        <div>To: {{getToDisplayText()}} at {{getDateDisplayText()}}</div>
                        <div class="panel panel-default bubble">{{message.text}}</div>
                    </div>
                </div>
                <div class="row" *ngIf="!message.outgoing">
                    <div class="col-md-10">
                        <div>{{getFromDisplayText()}} at {{getDateDisplayText()}}:</div>
                        <div class="panel panel-default bubble">
                            <span class="dropdown">
                                <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                                <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                                    <li>
                                        <a (click)="replying=true">Reply</a>
                                    </li>
                                    <template ngFor #contactGroup [ngForOf]="contactGroups" #groupIndex="index">
                                        <li>
                                            <a (click)="dispatchToContactGroup(message, contactGroup)">Forward to {{contactGroup.name}}</a>
                                        </li>
                                        <li *ngFor="#contact of contactGroup.contacts">
                                            <a (click)="dispatchToContact(message, contact)" *ngIf="contact.leader">Forward to {{contact.name}}</a>
                                        </li>
                                    </template>
                                </ul>
                            </span>
                            {{message.text}}
                            <message-send-form [fixedRecipient]="message.from" *ngIf="replying" (done)="replying=false"></message-send-form>
                        </div>
                    </div>
                    <div class="col-md-2">
                    </div>
                </div>
                
            </div>
        </div>
    `,
    directives: [MessageSendFormComponent],
    styles: [`
        .bubble {
            padding: 5px;
            border-radius: 10px;
        }
    `],
    inputs: ['message', 'selected']
})
export class SMSMessageComponent implements OnInit {
    public message: SMSMessage;
    public selected: boolean;
    public contacts: Contact[];
    public contactGroups: ContactGroup[];
    
    private replying: boolean = false;
    
    constructor(private _contactsService: ContactsService, private _messagesService: MessagesService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this.contacts = this._contactsService.getContacts();
        this.contactGroups = this._contactsService.getContactGroups();
    }
    
    private getClonedMessageForDispatch(original: SMSMessage): SMSMessage {
        let messageClone = JSON.parse(JSON.stringify(original));
        
        // include the original sender's phone number:
        messageClone.text = 'From sms:' + original.from + ' - ' + messageClone.text;
        
        return messageClone;
    }
    
    private dispatchToContact(message: SMSMessage, contact: Contact) {
        let messageClone = this.getClonedMessageForDispatch(message);
        messageClone.to = contact.phone;
        this._messagesService.sendMessage(messageClone).subscribe();
    }
    
    private dispatchToContactGroup(message: SMSMessage, contactGroup: ContactGroup) {
        let messageClone = this.getClonedMessageForDispatch(message);
        
        let recipients = contactGroup.contacts.map((contact) => {
            return contact.phone;
        });
        this._messagesService.sendMessages(messageClone, recipients).subscribe();
    }
    
    private getToDisplayText(): string {
        if (this.message.contact && this.message.contact.name) {
            return this.message.contact.name
        } else {
            return this.message.to;
        }
    }
    
    private getFromDisplayText(): string {
        if (this.message.contact && this.message.contact.name) {
            return this.message.contact.name
        } else {
            return this.message.from;
        }
    }
    
    private getDateDisplayText(): string {
        let nowDate: Date = new Date();
        
        if (!this.message.date || isNaN(this.message.date.getTime())) {
            return '';
        }
        
        let sameDates = ((nowDate.getFullYear() === this.message.date.getFullYear()) && 
          (nowDate.getMonth() === this.message.date.getMonth()) && 
          (nowDate.getDate() === this.message.date.getDate()));
          
        if (sameDates) {
            return this.message.date.toLocaleTimeString();
        } else {
            return this.message.date.toLocaleString();
        }
    }
}