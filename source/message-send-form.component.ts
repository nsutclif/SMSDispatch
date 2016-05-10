import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {NgForm, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';;
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
            <div class="form-group" *ngIf="fixedGroupLabel">
                <label>To</label>
                {{fixedGroupLabel}}
            </div>
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
    directives: [FORM_DIRECTIVES],
    inputs: ['fixedRecipient', 'fixedGroupLabel']
})
export class MessageSendFormComponent implements OnInit {
    lastError: string = '';
    success: boolean = false;
    form: ControlGroup;
    
    @Input()
    public fixedRecipient: string;
    
    // if fixedGroupLabel is set, then fixedrecipient is a comma separated list of recipients in this group.
    @Input()
    public fixedGroupLabel: string;
    
    @Output()
    public done = new EventEmitter();
    
    constructor(private _messagesService: MessagesService, private _formBuilder: FormBuilder) {
        this.resetModel();
    }
    
    onSubmit() {
        console.log(this.form.value);
        
        let recipientString: string;
        if (this.fixedRecipient) {
            recipientString = this.fixedRecipient;        
        } else {
            recipientString = this.form.value.to;
        }
        let recipients: string[] = recipientString.split(',');
        
        let message: SMSMessage = {
            id: '',
            text: this.form.value.body,
            date: new Date(),
            to: '',
            from: '',
            outgoing: true,
            contact: null
        };
        
        let messageObservable: Observable<any>;
        if (recipients.length === 1) {
            message.to = recipients[0];
            messageObservable = this._messagesService.sendMessage(message);
        } else {
            messageObservable = this._messagesService.sendMessages(message, recipients, this.fixedGroupLabel);
        }
        
        messageObservable.subscribe(
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