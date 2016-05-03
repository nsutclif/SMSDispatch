import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {NgForm, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {Contact} from './contact';
import {ContactsService} from './contacts.service';

@Component({
    selector: 'contact-form',
    template: `
      <form [ngFormModel]="form" (ngSubmit)="onSubmit()">
        <div class="form-group" *ngIf="!fixedPhoneNumber">
            <label for="phone">Phone</label>
            <input type="text" class="form-control" ngControl="phone" placeholder="Phone">
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
        
        <button type="submit" class="btn btn-default">Add</button>
        <button type="button" class="btn btn-default" (click)="doneAdding(0)">Cancel</button>
      </form>
    `,
    directives: [FORM_DIRECTIVES],
    inputs: ['fixedPhoneNumber','possibleName','possibleGroup']
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
    
    constructor(private _contactsService: ContactsService, private _formBuilder: FormBuilder) {        
    }
    
    onSubmit() {
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
        
        this._contactsService.addContact(newContact);
        this.doneAdding(1000);
    }
    
    private resetModel() {
        console.log(this.possibleGroup);
        console.log(this.possibleName);
        
        
        this.form = this._formBuilder.group({
            phone: ['', Validators.required],
            name: [this.possibleName, Validators.nullValidator],
            group: [this.possibleGroup, Validators.required],
            leader: [false, Validators.nullValidator]
        });
    }
    
    private doneAdding(doneEventDelay: number) {
        this.resetModel();
        setTimeout(() => {
            this.done.emit({});
        }, doneEventDelay);
    }
    
    ngOnInit() {
        this.resetModel();
    }
}