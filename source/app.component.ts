import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Contact} from './contact';
import {MessageListComponent} from './message-list.component';
import {ContactListComponent} from './contact-list.component';
import {ContactsService} from './contacts.service';
import {MessagesService} from './messages.service';

@Component({
    selector: 'dispatch-app',
    template:`
        <ul class="nav nav-tabs">
            <li role="presentation" [class.active]="isRouteActive('messages')"><a [routerLink]="['/Messages']">Messages</a></li>
            <li role="presentation" [class.active]="isRouteActive('contacts')"><a [routerLink]="['/Contacts']">Contacts</a></li>
        </ul>
        <router-outlet></router-outlet>
    `,
    directives: [MessageListComponent, ContactListComponent, ROUTER_DIRECTIVES],
    providers: [ContactsService, MessagesService]
})
@RouteConfig([
    { path: "/messages", 
      name: "Messages", 
      component: MessageListComponent, 
      useAsDefault: true },
    { path: "/contacts", 
      name: "Contacts", 
      component: ContactListComponent }
])
export class AppComponent {
    public title = 'SMS Dispatch';
    public currentRoute: string;
    constructor(router: Router) {
        var component: AppComponent = this;
        router.subscribe( function(route: string) {
          component.currentRoute = route;  
        });
    }
    
    onRouteChanged(path: string) {
        this.currentRoute = path;
    }
    
    isRouteActive(route: string): boolean {
        return route === this.currentRoute;
    }
}
