import {Component} from 'angular2/core';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';
import {ContactFormComponent} from'./contact-form.component'

@Component({
    selector: 'contact-list',
    template:`
      <button class="btn btn-default" type="submit" (click)="addLotsOfContacts()">Add lots of contacts</button>
    `
})
export class DebugComponent {
    public contacts: Contact[];
    
    constructor(private _contactsService: ContactsService) {        
    }

    public addLotsOfContacts() {
        let obfuscators = ['_', '-', '.'];
        
        let phoneNumbers = [];
        
        obfuscators.map(obfuscator1 => {
            obfuscators.map(obfuscator2 => {
                obfuscators.map(obfuscator3 => {
                    obfuscators.map(obfuscator4 => {
                        obfuscators.map(obfuscator5 => {
                            phoneNumbers.push('778' + obfuscator1 + obfuscator2 + obfuscator3 + obfuscator4 + '825' + obfuscator5 + '1056');
                        });
                    });              
                });
            });
        });
        
        phoneNumbers.map((phoneNumber, index)=> {
            let newContact: Contact = {
                phone: phoneNumber,
                name: 'Volunteer' + index,
                group: 'Volunteers',
                leader: false 
            };
            this._contactsService.addContact(newContact);
        });
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
