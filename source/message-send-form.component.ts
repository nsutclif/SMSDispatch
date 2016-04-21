import {Component, OnInit} from 'angular2/core';
import {NgForm, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';

// Using an ngFormModel form seems to be a lot faster than the [()] (two way binding) type of
// form.  I couldn't figure out how to reset the values on a (ngModelChange) (one way binding)
// type of form.

@Component({
    selector: 'message-send-form',
    template: `
    <div class="panel">
        <form [ngFormModel]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
                <label for="to">To</label>
                <input type="text" class="form-control" ngControl="to" placeholder="To">
            </div>
            <div class="form-group">
                <label for="to">Message</label>
                <input type="textarea" class="form-control" ngControl="body" placeholder="Message">
            </div>
            <button type="submit" class="btn btn-default">Send</button>
            <span *ngIf="!success">{{lastError}}</span>
            <span class="glyphicon glyphicon-ok" *ngIf="success"></span>
        </form>
    </div>
    `,
    directives: [FORM_DIRECTIVES]
})
export class MessageSendFormComponent implements OnInit {
    message: SMSMessage = {id: '', text: 'Sample Message 1', date: new Date(), to: '', from: ''};
    to: string;
    lastError: string = '';
    success: boolean = false;
    form: ControlGroup;
    
    constructor(private _messagesService: MessagesService, fb: FormBuilder) {
        this.form = fb.group({
            to: ['', Validators.required],
            body: ['', Validators.required]
        });
    }
    
    onSubmit() {
        console.log(this.form.value);
        
        let recipients: string[] = this.form.value.to.split(',');
        
        let message: SMSMessage = {
            id: '',
            text: this.form.value.body,
            date: new Date(),
            to: '',
            from: ''            
        };
        
        this._messagesService.sendMessages(message, recipients).subscribe(
            (message) => {
                this.resetModel();
                this.success = true;
                this.lastError = '';
            },
            (error) => {
                this.success = false;
                this.lastError = error;
            }
        );
    }
    
    resetModel() {
        //this.message = {id: '', text: '', date: new Date(), to: '', from : ''};
        //this.to = '';
        this.form.value.to = '';
        this.form.value.body = '';
    }
    
    ngOnInit() {
        this.resetModel();
    }
}