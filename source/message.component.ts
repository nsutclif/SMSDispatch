import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';
import {Contact, ContactGroup} from './contact'; 
import {ContactsService} from './contacts.service';

@Component({
    selector: 'sms-message',
    template:`
        <div class="message">
            <span>
                {{message.from}}
            </span>
            <span class="panel panel-default bubble">
                <span>
                    {{message.text}}
                </span>
                <span>
                    <span class="dropdown">
                        <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                        <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                            <template ngFor #contactGroup [ngForOf]="contactGroups" #groupIndex="index">
                                <li>
                                    <a (click)="dispatchToContactGroup(message, contactGroup)">Forward to {{contactGroup.name}}</a>
                                </li>
                                <li *ngFor="#contact of contactGroup.contacts">
                                    <a (click)="DispatchToContact(message, contact)" *ngIf="contact.leader">Forward to {{contact.name}}</a>
                                </li>
                            </template>
                        </ul>
                    </span>
                </span>
            </span>
        </div>
    `,
    styles: [`
        .bubble {
            padding: 10px;
            border-radius: 10px;
        }
        .message {
            padding: 10px;
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
    
    private DispatchToContact(message: SMSMessage, contact: Contact) {
        let messageClone = JSON.parse(JSON.stringify(message));
        messageClone.to = contact.phone;
        this._messagesService.sendMessage(messageClone).subscribe();
    }
    
    private dispatchToContactGroup(message: SMSMessage, contactGroup: ContactGroup) {
        let messageClone = JSON.parse(JSON.stringify(message));
        let recipients = contactGroup.contacts.map((contact) => {
            return contact.phone;
        });
        this._messagesService.sendMessages(message, recipients).subscribe();
    }
}