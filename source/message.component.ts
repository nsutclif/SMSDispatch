import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';
import {Contact, ContactGroup} from './contact'; 
import {ContactsService} from './contacts.service';
import {MessageSendFormComponent} from './message-send-form.component';
import {ContactFormComponent} from './contact-form.component';

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
                                    <li>
                                        <a (click)="addingContact=true">Add Contact</a>
                                    </li>
                                    <template ngFor let-contactGroup [ngForOf]="contactGroups">
                                        <li>
                                            <a (click)="dispatchToContactGroup(message, contactGroup)">Forward to {{contactGroup.name}}</a>
                                        </li>
                                        <li *ngFor="let contact of contactGroup.contacts">
                                            <a (click)="dispatchToContact(message, contact)" *ngIf="contact.leader">Forward to {{contact.name}}</a>
                                        </li>
                                    </template>
                                </ul>
                            </span>
                            {{message.text}}
                            <message-send-form [fixedRecipient]="message.from" *ngIf="replying" (done)="replying=false"></message-send-form>
                            <contact-form [fixedPhoneNumber]="message.from" [possibleName]="possibleName" [possibleGroup]="possibleGroup" (done)="addingContact=false" *ngIf="addingContact"></contact-form>
                        </div>
                    </div>
                    <div class="col-md-2">
                    </div>
                </div>
                
            </div>
        </div>
    `,
    directives: [MessageSendFormComponent, ContactFormComponent],
    styles: [`
        .bubble {
            padding: 5px;
            border-radius: 10px;
        }
    `],
    inputs: ['message']
})
export class SMSMessageComponent implements OnInit {
    private _message: SMSMessage;
    
    get message(): SMSMessage {
        return this._message;
    }    
    set message(newMessage: SMSMessage) {
        this._message = newMessage;
        //this.extractContactDetails();
    }
    
    private contacts: Contact[];
    private contactGroups: ContactGroup[];
    
    private replying: boolean = false;
    private addingContact: boolean = false;
    
    private possibleGroup: string;
    private possibleName: string;

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
    
    private stripDelimiters (inputString: string): string {
        // Extract any words.  Leave behind things like colons and spaces.
        // https://regex101.com/#javascript
        let regexResult: string[] = /\w+(\s+\w+)*/.exec(inputString);
        
        if (Array.isArray(regexResult)) {
            return regexResult[0];
        } else {
            console.log('stripDelimiters regex not found');
            return inputString;
        };
    };
                
    private extractContactDetails() {
        this.possibleGroup = '';
        this.possibleName = '';
        
        let messageText = this.message.text;
        
        let lowerCaseText = messageText.toLowerCase();
        
        let joinPos = lowerCaseText.indexOf('join');
        
        if (joinPos !==-1) {
            let namePos = lowerCaseText.indexOf('name');
            
            let possibleName = '';
            if (namePos > joinPos) {
                possibleName = messageText.slice(namePos + 4);
                
                messageText = messageText.slice(0, namePos);
            }
            let possibleGroup = messageText.slice(joinPos + 4);
            
            possibleGroup = this.stripDelimiters(possibleGroup);
            possibleName = this.stripDelimiters(possibleName);
            
            this.possibleGroup = possibleGroup;
            this.possibleName = possibleName;
        }  
    }
}