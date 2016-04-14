import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {SMSMessage} from './message';
import {MessagesService} from './messages.service';

@Component({
    selector: 'message-send-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="form-group">
                <label for="to">To</label>
                <input type="text" [(ngModel)]="model.to" ngControl="to">
            </div>
            <div class="form-group">
                <input type="text" [(ngModel)]="model.text" ngControl="body">
            </div>
            <button type="submit">Send</button>
      </form>
    `
})
export class MessageSendFormComponent implements OnInit {
    model: SMSMessage = {id: 1, text: 'Sample Message 1', date: new Date(), to: '+7787710823', from: '+7788251056'};
    
    constructor(private _messagesService: MessagesService) {        
    }
    
    onSubmit() {
        this._messagesService.sendMessage(this.model);
        this.resetModel();
    }
    
    resetModel() {
        this.model = {id: 0, text: '', date: new Date(), to: '', from : ''};
    }
    
    ngOnInit() {
        this.resetModel();
    }
}