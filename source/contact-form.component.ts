import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-form',
    template: `
      <form (ngSubmit)="onSubmit()">
        <label for="phone">Phone</label>
        <input type="text" (ngModelChange)="model.phone = $event" ngControl="phone">
        <label for="name">Name</label>
        <input type="text" (ngModelChange)="model.name = $event" ngControl="name">
        <label for="group">Group</label>
        <input type="text" (ngModelChange)="model.group = $event" ngControl="group">
        <label for="leader">Leader</label>
        <input type="checkbox" (ngModelChange)="model.leader = $event" ngControl="leader">
        
        <button type="submit">Add</button>
      </form>
    `
})
export class ContactFormComponent {
    model: Contact = {group: '', leader: false, name: '', phone: ''};
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    onSubmit() {
        this._contactsService.addContact(this.model);
    }
}