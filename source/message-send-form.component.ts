import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {NgForm, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';
import {Contact} from './contact';

// Using an ngFormModel form seems to be a lot faster than the [()] (two way binding) type of
// form.  I couldn't figure out how to reset the values on a (ngModelChange) (one way binding)
// type of form.

@Component({
    selector: 'message-send-form',
    template: `
    <div class="panel">
        <form [ngFormModel]="form" (ngSubmit)="onSubmit()">
            <div class="form-group" *ngIf="!fixedRecipient">
                <label for="to">To</label>
                <input type="text" class="form-control" ngControl="to" placeholder="To">
            </div>
            <div class="form-group">
                <label for="to">Message</label>
                <input type="textarea" class="form-control" ngControl="body" placeholder="Message">
            </div>
            <button type="submit" class="btn btn-default">Send</button>
            <button type="button" class="btn btn-default" *ngIf="fixedRecipient" (click)="doneSending(0)">Cancel</button>
            <span *ngIf="!success">{{lastError}}</span>
            <span class="glyphicon glyphicon-ok" *ngIf="success"></span>
        </form>
    </div>
    `,
    directives: [FORM_DIRECTIVES]
})
export class MessageSendFormComponent implements OnInit {
    lastError: string = '';
    success: boolean = false;
    form: ControlGroup;
    
    @Input()
    public fixedRecipient: Contact;
    
    @Output()
    public done = new EventEmitter();
    
    constructor(private _messagesService: MessagesService, private _formBuilder: FormBuilder) {
        this.resetModel();
    }
    
    onSubmit() {
        console.log(this.form.value);
        
        let recipients: string[];
        if (this.fixedRecipient) {
            recipients = [this.fixedRecipient.phone];        
        } else {
            recipients = this.form.value.to.split(',');
        }
        
        let message: SMSMessage = {
            id: '',
            text: this.form.value.body,
            date: new Date(),
            to: '',
            from: '',
            outgoing: true,
        };
        
        this._messagesService.sendMessages(message, recipients).subscribe(
            (message) => {
                this.doneSending(1000);
                this.success = true;
                this.lastError = '';
            },
            (error) => {
                this.success = false;
                this.lastError = error;
            }
        );
    }
    
    private resetModel() {
        this.form = this._formBuilder.group({
            to: ['', Validators.required],
            body: ['', Validators.required]
        });
    }
    
    private doneSending(doneEventDelay: number) {
        this.resetModel();
        setTimeout(() => {
            this.done.emit({});
        }, doneEventDelay);
    }
    
    ngOnInit() {
        this.resetModel();
    }
}