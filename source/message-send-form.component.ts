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
                <input type="text" class="form-control" [(ngModel)]="model.to" ngControl="to" placeholder="To">
            </div>
            <div class="form-group">
                <label for="to">Message</label>
                <input type="textarea" class="form-control" [(ngModel)]="model.text" ngControl="body" placeholder="Message">
            </div>
            <button type="submit" class="btn btn-default">Send</button>
            <span>{{lastError}}</span>
        </form>
    </div>
    `
})
export class MessageSendFormComponent implements OnInit {
    model: SMSMessage = {id: 1, text: 'Sample Message 1', date: new Date(), to: '+7787710823', from: '+7788251056'};
    lastError: string = '';
    
    constructor(private _messagesService: MessagesService) {        
    }
    
    onSubmit() {
        this._messagesService.sendMessage(this.model).subscribe(
            (message) => {
                this.resetModel();
                this.lastError = 'Sent';
            },
            (error) => {
                this.lastError = error;
            }
        );
    }
    
    resetModel() {
        this.model = {id: 0, text: '', date: new Date(), to: '', from : ''};
    }
    
    ngOnInit() {
        this.resetModel();
    }
}