import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Contact, ContactGroup} from './contact';
import {MessageListComponent} from './message-list.component';

var CONTACT_GROUPS: ContactGroup[] = [
    {"id": 1, "name": "Organizers", "contacts": [
        {"id": 1, "name": "Terry", "phone": "555-555-1111"},
        {"id": 2, "name": "Mary", "phone": "555-555-1112"}
        ]},
    {"id": 1, "name": "Volunteers", "contacts": [
        {"id": 3, "name": "Bary", "phone": "555-555-1113"},
        {"id": 4, "name": "Perry", "phone": "555-555-1114"},
        {"id": 5, "name": "Carry", "phone": "555-555-1115"},
        {"id": 6, "name": "Fairy", "phone": "555-555-1116"},
        {"id": 7, "name": "Harry", "phone": "555-555-1117"},
        {"id": 8, "name": "Sherry", "phone": "555-555-1118"},
        {"id": 9, "name": "Lary", "phone": "555-555-1119"}
        ]}
] 

@Component({
    selector: 'dispatch-app',
    template:`
        <h1>{{title}}</h1>
        <message-list [contactGroups]="contactGroups">
        </message-list>
        
        <a [routerLink]="['/Messages']">Messages</a>
        
        <router-outlet></router-outlet>
    `,
    directives: [MessageListComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: "/messages", 
      name: "Messages", 
      component: MessageListComponent, 
      useAsDefault: true }
])
export class AppComponent {
    public title = 'SMS Dispatch';
    public contactGroups = CONTACT_GROUPS;
}
