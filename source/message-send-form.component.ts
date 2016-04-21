import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';

@Component({
    selector: 'message-send-form',
    template: `
    <div class="panel">
        <form (ngSubmit)="onSubmit()">
            <div class="form-group">
                <label for="to">To</label>
                <input type="text" class="form-control" [(ngModel)]="to" ngControl="to" placeholder="To">
            </div>
            <div class="form-group">
                <label for="to">Message</label>
                <input type="textarea" class="form-control" [(ngModel)]="message.text" ngControl="body" placeholder="Message">
            </div>
            <button type="submit" class="btn btn-default">Send</button>
            <span *ngIf="!success">{{lastError}}</span>
            <span class="glyphicon glyphicon-ok" *ngIf="success"></span>
        </form>
    </div>
    `
})
export class MessageSendFormComponent implements OnInit {
    message: SMSMessage = {id: '', text: 'Sample Message 1', date: new Date(), to: '', from: ''};
    to: string;
    lastError: string = '';
    success: boolean = false;
    
    constructor(private _messagesService: MessagesService) {        
    }
    
    onSubmit() {
        let recipients: string[] = this.to.split(',');
        
        this._messagesService.sendMessages(this.message, recipients).subscribe(
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
        this.message = {id: '', text: '', date: new Date(), to: '', from : ''};
        this.to = '';
    }
    
    ngOnInit() {
        this.resetModel();
    }
}