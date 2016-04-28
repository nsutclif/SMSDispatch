import {Component, OnInit} from 'angular2/core';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';
import {ContactFormComponent} from './contact-form.component';
import {MessageSendFormComponent} from './message-send-form.component';

@Component({
    selector: 'contact-list',
    template:`
        <contact-form></contact-form>
        <table class="table table-compact">
          <tr>
            <th></th>
            <th>Phone</th>
            <th>Name</th>
            <th>Group</th>
            <th></th>
          </tr>
          <template ngFor #contact [ngForOf]="contacts">
            <tr>
                <td>
                <div class="dropdown">
                    <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                    <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                    <li><a (click)="sendMessageToContact(contact)">Send Message to Contact</a></li>
                    <li><a (click)="deleteContact(contact)">Delete</a></li>
                    </ul>
                </div>
                </td>
                <td>{{contact.phone}}</td>
                <td>{{contact.name}}</td>
                <td>{{contact.group}}</td>
                <td><span *ngIf="contact.leader">Leader</span></td>
            </tr>
            <tr *ngIf="contact===messageRecipient">
              <td></td>
              <td colspan=4>
                <message-send-form [fixedRecipient]="contact" (done)="doneSendingMessageToContact()"></message-send-form>
              </td>
            </tr>
          </template>
        </table>
    `,
    directives: [ContactFormComponent, MessageSendFormComponent]
})
export class ContactListComponent implements OnInit {
    public contacts: Contact[];
    private messageRecipient: Contact;
    
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
    
    private deleteContact(contact: Contact) {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            this._contactsService.deleteContact(contact);
        }
    }
    
    private sendMessageToContact(contact: Contact) {
        this.messageRecipient = contact;
    }
    
    private doneSendingMessageToContact() {
        this.messageRecipient = null;
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
