import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Contact} from './contact';
import {MessageListComponent} from './message-list.component';
import {ContactListComponent} from './contact-list.component';
import {ContactsService} from './contacts.service';
import {MessagesService} from './messages.service';
import {ConfigService} from './config.service';
import {ConfigFormComponent} from './config-form.component';
import {AWSService} from './aws.service';
import {DebugComponent} from './debug.component';

@Component({
    selector: 'dispatch-app',
    template:`
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-collapse">
                    <ul *ngIf="_awsService.signedIn()" class="nav navbar-nav navbar-left">
                        <li role="presentation" [class.active]="isRouteActive('Messages')"><a [routerLink]="['/Messages']">Messages</a></li>
                        <li role="presentation" [class.active]="isRouteActive('Contacts')"><a [routerLink]="['/Contacts']">Contacts</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <button *ngIf="!_awsService.signedIn()" type="button" class="btn btn-default navbar-btn" (click)="signIn()">Sign in</button>
                        <!--<li *ngIf="_awsService.signedIn()" role="presentation" [class.active]="isRouteActive('Config')"><a [routerLink]="['/Config']">Config</a></li>-->
                    </ul>
                </div>
            </div>
        </nav>
        <router-outlet *ngIf="_awsService.signedIn()"></router-outlet>
    `,
    directives: [MessageListComponent, ContactListComponent, ConfigFormComponent, DebugComponent, ROUTER_DIRECTIVES],
    providers: [AWSService, ConfigService, ContactsService, MessagesService]
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
      component: ConfigFormComponent },
    { path: "/debug", 
      name: "Debug", 
      component: DebugComponent }
])
export class AppComponent {
    public title = 'SMS Dispatch';
    public currentRouteName: string;
    constructor(
        router: Router,
        private _awsService: AWSService,
        private _contactsService: ContactsService,
        private _configService: ConfigService) {
        var component: AppComponent = this;
        router.subscribe(function(route: any) {
            component.currentRouteName = route.instruction.routeName;
        });
    }
    
    isRouteActive(route: string): boolean {
        return route === this.currentRouteName;
    }
    
    signIn(): void {
        // TODO: FIX THIS MESS.
        this._awsService.signIn().then( ()=>{ 
            this._contactsService.loadContacts();
            // this._configService.loadConfig();
        });
    }
}
