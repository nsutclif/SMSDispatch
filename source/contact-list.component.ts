import {Component, OnInit} from 'angular2/core';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';
import {ContactFormComponent} from'./contact-form.component'

@Component({
    selector: 'contact-list',
    template:`
        <contact-form></contact-form>
        <table class="table table-compact">
          <tr>
            <th>Phone</th>
            <th>Name</th>
            <th>Group</th>
            <th></th>
            <th></th>
          </tr>
          <tr *ngFor="#contact of contacts">
            <td>{{contact.phone}}</td>
            <td>{{contact.name}}</td>
            <td>{{contact.group}}</td>
            <td><span *ngIf="contact.leader">Leader</span></td>
            <td align="right">
              <div class="dropdown">
                <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                  <li><a (click)="deleteContact(contact)">Delete</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </table>
    `,
    directives: [ContactFormComponent]
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
        });
    }
    
    deleteContact(contact: Contact) {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            this._contactsService.deleteContact(contact);
        }        
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
