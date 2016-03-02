import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Contact} from './contact';
import {MessageListComponent} from './message-list.component';
import {ContactListComponent} from './contact-list.component';
import {ContactsService} from './contacts.service';
import {MessagesService} from './messages.service';
import {ConfigService} from './config.service';
import {ConfigFormComponent} from './config-form.component';

@Component({
    selector: 'dispatch-app',
    template:`
        <ul class="nav nav-tabs">
            <li role="presentation" [class.active]="isRouteActive('messages')"><a [routerLink]="['/Messages']">Messages</a></li>
            <li role="presentation" [class.active]="isRouteActive('contacts')"><a [routerLink]="['/Contacts']">Contacts</a></li>
            <li role="presentation" [class.active]="isRouteActive('config')"><a [routerLink]="['/Config']">Config</a></li>
        </ul>
        <router-outlet></router-outlet>
    `,
    directives: [MessageListComponent, ContactListComponent, ConfigFormComponent, ROUTER_DIRECTIVES],
    providers: [ConfigService, ContactsService, MessagesService]
})
@RouteConfig([
    { path: "/messages", 
      name: "Messages", 
      component: MessageListComponent, 
      useAsDefault: true },
    { path: "/contacts", 
      name: "Contacts", 
      component: ContactListComponent },
    { path: "/config", 
      name: "Config", 
      component: ConfigFormComponent }
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
