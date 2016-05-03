import {Component, OnInit} from 'angular2/core';
import {Contact, ContactGroup} from './contact';
import {ContactsService} from './contacts.service';
import {ContactFormComponent} from './contact-form.component';
import {MessageSendFormComponent} from './message-send-form.component';

@Component({
    selector: 'contact-list',
    template:`
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <button type="button" class="btn btn-default navbar-btn" (click)="addingContact=true">Add Contact</button>
                <form class="form-inline navbar-form navbar-right">
                    <div class="form-group" align="right">
                        <input type="text" class="form-control" id="searchText" (keyup)="setSearchText($event.target.value)" placeholder="Search">
                    </div>
                </form>
            </div>
        </nav>
        <contact-form *ngIf="addingContact" (done)="addingContact=false"></contact-form>
        <table class="table table-compact">
          <tr>
            <th></th>
            <th>Name</th>
            <th>Group</th>
            <th>Phone</th>
            <th></th>
          </tr>
          <template ngFor let-contact [ngForOf]="filteredContacts">
            <tr>
                <td>
                <div class="dropdown">
                    <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                    <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                    <li><a (click)="editContact(contact)">Edit</a></li>
                    <li><a (click)="deleteContact(contact)">Delete</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a (click)="sendMessageToContact(contact)">Send Message to {{contact.name}}</a></li>
                    <li><a (click)="sendMessageToContactGroup(contact)">Send Message to {{contact.group}} Group</a></li>
                    </ul>
                </div>
                </td>
                <td>{{contact.name}}</td>
                <td>{{contact.group}}</td>
                <td>{{contact.phone}}</td>
                <td><span *ngIf="contact.leader">Leader</span></td>
            </tr>
            <tr *ngIf="contact===messageRecipient">
              <td></td>
              <td colspan=4>
                <message-send-form [fixedRecipient]="messageRecipientPhone" [fixedGroupLabel]="messageRecipientLabel" (done)="doneSendingMessageToContact()"></message-send-form>
              </td>
            </tr>
            <tr *ngIf="contact===recipientBeingEdited">
              <td></td>
              <td colspan=4>
                <contact-form></contact-form>
              </td>
            </tr>
          </template>
        </table>
    `,
    directives: [ContactFormComponent, MessageSendFormComponent]
})
export class ContactListComponent implements OnInit {
    public contacts: Contact[];
    public filteredContacts: Contact[];
    private messageRecipient: Contact;
    private messageRecipientPhone: string;
    private messageRecipientLabel: string;
    
    private recipientBeingEdited: Contact;
    
    private addingContact: boolean = false;
    
    private searchText: string = '';
    
    private setSearchText(searchText: string) {
        this.searchText = searchText;
        this.updateFilteredContacts();
    }
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this.contacts = this._contactsService.getContacts();
        this.updateFilteredContacts(); 
    }
    
    private editContact(contact: Contact) {
        this.recipientBeingEdited = contact;
    }
    
    private deleteContact(contact: Contact) {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            this._contactsService.deleteContact(contact);
        }
    }
    
    private sendMessageToContact(contact: Contact) {
        this.messageRecipient = contact;
        this.messageRecipientPhone = contact.phone;
        this.messageRecipientLabel = '';
    }
    
    private sendMessageToContactGroup(contact: Contact) {
        let contactGroup: ContactGroup = this._contactsService.getContactGroup(contact.group);
        if (!contactGroup) {
            throw new Error('Contact group not found: ' + contactGroup);
        }
        this.messageRecipient = contact; // this keeps track of where to show the form
        let groupPhones: string[] = contactGroup.contacts.map((contact) => {
            return contact.phone
        })
        this.messageRecipientPhone = groupPhones.join(',');
        this.messageRecipientLabel = contact.group;
    }
    
    private doneSendingMessageToContact() {
        this.messageRecipient = null;
        this.messageRecipientPhone = '';
        this.messageRecipientLabel = '';
    }
    
    private updateFilteredContacts() {
        // This code isn't called when the contacts service finishes synchronizing the contacts (I think)
        //     Possible workaround: Set this.filteredContacts = this.contacts if !searchText?
        
        // If we need to debounce:
        // http://stackoverflow.com/questions/32051273/angular2-and-debounce
        
        let lowerSearchText = this.searchText.toLowerCase();
        
        this.filteredContacts = this.contacts.filter((value: Contact): boolean => {
            return (
                (this.searchText === '')
                || (value.group.toLowerCase().indexOf(lowerSearchText) !== -1)
                || (value.name.toLowerCase().indexOf(lowerSearchText) !== -1)                
                || (value.phone.toLowerCase().indexOf(lowerSearchText) !== -1)                
            );
        });
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
