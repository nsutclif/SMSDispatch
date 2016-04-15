import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-form',
    template: `
      <form (ngSubmit)="onSubmit()">
        <label for="phone">Phone</label>
        <input type="text" class="form-control" (ngModelChange)="model.phone = $event" ngControl="phone" placeholder="Phone">
        <label for="name">Name</label>
        <input type="text" class="form-control" (ngModelChange)="model.name = $event" ngControl="name" placeholder="Name">
        <label for="group">Group</label>
        <input type="text" class="form-control" (ngModelChange)="model.group = $event" ngControl="group" placeholder="Group">
        <label for="leader">Leader</label>
        <input type="checkbox" class="form-control" (ngModelChange)="model.leader = $event" ngControl="leader">
        
        <button type="submit" class="btn btn-default">Add</button>
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