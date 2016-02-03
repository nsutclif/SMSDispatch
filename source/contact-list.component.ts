import {Component, OnInit} from 'angular2/core';
import {ContactGroup} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-list',
    template:`
        <template ngFor #contactGroup [ngForOf]="contactGroups" #groupIndex="index">
            <h3>{{contactGroup.name}}</h3>
            <ul class="list-group">
                <li *ngFor="#contact of contactGroup.contacts"
                    class="list-group-item">
                    {{contact.name}}
                </li>
            </ul>
        </template>
    `,
})
export class ContactListComponent implements OnInit {
    public contactGroups: ContactGroup[];
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._contactsService.getContactGroups().then(contactGroups => this.contactGroups = contactGroups);
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
