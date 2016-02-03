import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './sms-message';
import {Contact, ContactGroup} from './contact'; 
import {ContactsService} from './contacts.service';

@Component({
    selector: 'sms-message',
    template:`
        {{message.text}}
        <span *ngIf="selected">
            <button type="button" class="btn btn-default">
                Done
            </button>
            <span class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Forward
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                    <template ngFor #contactGroup [ngForOf]="contactGroups" #groupIndex="index">
                        <li><a href="#">{{contactGroup.name}}</a></li>
                        
                        <li *ngFor="#contact of contactGroup.contacts">
                            <a href="#">{{contact.name}}</a>
                        </li>
                        
                        <li *ngIf="groupIndex < contactGroups.length - 1" role="separator" class="divider"></li>
                    </template>
                </ul>
            </span>        
        </span>
    `,
    inputs: ['message', 'selected']
})
export class SMSMessageComponent implements OnInit {
    public message: SMSMessage;
    public selected: boolean;
    // TODO: Does Contact Groups make sense as some sort of central service?
    public contactGroups: ContactGroup[];
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._contactsService.getContactGroups().then(contactGroups => this.contactGroups = contactGroups);
    }
}