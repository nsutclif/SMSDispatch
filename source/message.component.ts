import {Component, OnInit} from 'angular2/core';
import {SMSMessage} from './message';
import {Contact} from './contact'; 
import {ContactsService} from './contacts.service';

@Component({
    selector: 'sms-message',
    template:`
        <div class="message">
            <span>
                {{message.from}}
            </span>
            <span class="panel panel-default bubble">
                <span>
                    {{message.text}}
                </span>
                <!--<span *ngIf="selected">
                    <button type="button" class="btn btn-default">
                        Done
                    </button>
                    <span class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Forward
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <template ngFor #contactGroup [ngForOf]="contactGroups" #groupIndex="index">
                                <li><a href="#">{{contactGroup.name}}</a></li>
                                
                                <li *ngFor="#contact of contactGroup.contacts">
                                    <a href="#">{{contact.name}}</a>
                                </li>
                                
                                <li *ngIf="groupIndex < contactGroups.length - 1" role="separator" class="divider"></li>
                            </template>
                        </ul>
                    </span>        
                </span>-->
                <span>
                    <span class="dropdown">
                        <span class="glyphicon glyphicon-option-vertical dropdown-toggle" id="contactActionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>
                        <ul class="dropdown-menu" aria-labelledby="contactActionsDropdown">
                            <li><a (click)="deleteContact(contact)">Delete</a></li>
                        </ul>
                    </span>
                </span>
            </span>
        </div>
    `,
    styles: [`
        .bubble {
            padding: 10px;
            border-radius: 10px;
        }
        .message {
            padding: 10px;
        }
    `],
    inputs: ['message', 'selected']
})
export class SMSMessageComponent implements OnInit {
    public message: SMSMessage;
    public selected: boolean;
    public contacts: Contact[];
    
    constructor(private _contactsService: ContactsService) {        
    }
    
    ngOnInit() {
        this.getContacts();
    }
    
    getContacts() {
        this._contactsService.getContacts().then(contacts => this.contacts = contacts);
    }
}