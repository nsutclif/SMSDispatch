import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';
import {Contact, ContactGroup} from './contact'; 
import {ContactsService} from './contacts.service';

@Component({
    selector: 'sms-message',
    template:`
        <div class="message">
            <div class="container-fluid">
                <div class="row" *ngIf="message.outgoing">
                    <div class="col-md-2">
                    </div>
                    <div class="col-md-10">
                        <div>To: {{message.to}}</div>
                        <div class="panel panel-default bubble">{{message.text}}</div>
                    </div>
                </div>
                <div class="row" *ngIf="!message.outgoing">
                    <div class="col-md-10">
                        <div>{{message.from}}:</div>
                        <div class="panel panel-default bubble">
                            <span class="dropdown">
                                <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                                <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
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
                        </div>
                    </div>
                    <div class="col-md-2">
                    </div>
                </div>
                
            </div>
        </div>
    `,
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
    
    constructor(private _contactsService: ContactsService, private _messagesService: MessagesService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._contactsService.getContacts().then((contacts) => {
            this.contacts = contacts;
            this.contactGroups = this._contactsService.getContactGroups();
        });
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
}