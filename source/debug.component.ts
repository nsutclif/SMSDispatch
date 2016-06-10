import {Component} from '@angular/core';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';
import {ContactFormComponent} from'./contact-form.component'

@Component({
    selector: 'contact-list',
    template:`
      <form (ngSubmit)="addLotsOfContacts()">
        <input type="text" class="form-control" (ngModelChange)="areaCode = $event" ngControl="areaCode" placeholder="555">
        <input type="text" class="form-control" (ngModelChange)="officeCode = $event" ngControl="officeCode" placeholder="555">
        <input type="text" class="form-control" (ngModelChange)="stationNumber = $event" ngControl="stationNumber" placeholder="5555">
        <button class="btn btn-default" type="submit">Add lots of contacts</button>
      </form>
    `
})
export class DebugComponent {
    areaCode: string = '';
    officeCode: string = '';
    stationNumber: string = '';
    
    
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
                            phoneNumbers.push(
                                this.areaCode + obfuscator1 + obfuscator2 + obfuscator3 + obfuscator4 + 
                                this.officeCode + obfuscator5 + 
                                this.stationNumber);
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
            console.log(JSON.stringify(newContact));
        });
    }
    
    // onSelect(message: SMSMessage) {
    //     this.selectedMessage = message;
    // }
}
