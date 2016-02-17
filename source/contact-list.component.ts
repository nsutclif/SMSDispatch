import {Component, OnInit} from 'angular2/core';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-list',
    template:`
        <table class="table">
          <tr>
            <th>Group</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Leader</th>
          </tr>
          <tr *ngFor="#contact of contacts">
            <td>{{contact.group}}</td>
            <td>{{contact.name}}</td>
            <td>{{contact.phone}}</td>
            <td>{{contact.leader}}</td>
          </tr>
        </table>
    `,
})
export class ContactListComponent implements OnInit {
    public contacts: Contact[];
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._contactsService.getContacts().then(contacts => {
            this.contacts = contacts;
            console.log(JSON.stringify(contacts));
        });
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
