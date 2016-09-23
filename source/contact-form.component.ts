import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgForm, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES} from '@angular/common';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-form',
    template: `
      <form [ngFormModel]="form" (ngSubmit)="onSubmit()">
        <div class="form-group" *ngIf="!fixedPhoneNumber">
            <label for="phone">Phone</label>
            <input type="text" class="form-control" ngControl="phone" placeholder="Phone">
            <div>{{phoneError}}</div>
        </div>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" ngControl="name" placeholder="Name">
        </div>
        <div class="form-group">
            <label for="group">Group</label>
            <input type="text" class="form-control" ngControl="group" placeholder="Group">
        </div>
        <label for="leader">Leader</label>
        <input type="checkbox" class="form-control" ngControl="leader">
        
        <button type="submit" class="btn btn-default">Save</button>
        <button type="button" class="btn btn-default" (click)="doneAdding(0)">Cancel</button>
      </form>
    `,
    directives: [FORM_DIRECTIVES],
    inputs: ['fixedPhoneNumber','possibleName','possibleGroup','existingContact']
})
export class ContactFormComponent implements OnInit {
    form: ControlGroup;
    
    @Output()
    public done = new EventEmitter();
        
    @Input()
    public fixedPhoneNumber: string;
    
    @Input()
    public possibleName: string;
    
    @Input()
    public possibleGroup: string;
    
    @Input()
    public existingContact: Contact;

    private phoneError: string;
    
    constructor(private _contactsService: ContactsService, private _formBuilder: FormBuilder) {        
    }
    
    onSubmit() {
        let success: boolean = true;

        if (this.existingContact) {
            this.existingContact.name = this.form.value.name;
            this.existingContact.group = this.form.value.group;
            this.existingContact.leader = this.form.value.leader;
            
            this._contactsService.updateContact(this.existingContact);
        } else {
            let phone: string;
            if (this.fixedPhoneNumber) {
                phone = this._contactsService.stripPhoneNumber(this.fixedPhoneNumber);
            } else {
                phone = this.form.value.phone;
            }
            
            let newContact: Contact = {
                phone: phone,
                name: this.form.value.name,
                group: this.form.value.group,
                leader: this.form.value.leader
            }

            let matchingContact: Contact = this._contactsService.getContactByPhoneApprox(phone);
            if (matchingContact) {
                this.phoneError = 'Phone number ' + phone + ' already in use by ' + matchingContact.name;
                success = false;
            }
            else {
               this._contactsService.addContact(newContact);
            }
        }

        if (success) {
            this.doneAdding(1000);
        }
    }
    
    private resetModel() {
        console.log(this.possibleGroup);
        console.log(this.possibleName);
        
        let initialName: string;
        let initialGroup: string;
        let initialLeader: boolean;
        if (this.existingContact) {
            initialName = this.existingContact.name;
            initialGroup = this.existingContact.group;
            initialLeader = this.existingContact.leader;
        } else {
            initialName = this.possibleName;
            initialGroup = this.possibleGroup;
            initialLeader = false;
        }
        
        this.form = this._formBuilder.group({
            phone: ['', Validators.required],
            name: [initialName, Validators.nullValidator],
            group: [initialGroup, Validators.required],
            leader: [initialLeader, Validators.nullValidator]
        });

        this.phoneError = '';
    }
    
    private doneAdding(doneEventDelay: number) {
        this.possibleName = '';
        this.possibleGroup = '';
        this.resetModel();
        setTimeout(() => {
            this.done.emit({});
        }, doneEventDelay);
    }
    
    ngOnInit() {
        this.resetModel();
    }
}