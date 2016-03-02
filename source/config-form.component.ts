import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Config} from './config';
import {ConfigService} from './config.service';


@Component({
    selector: 'config-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="twilioAccountSID">Account SID</label>
              <input type="text" (ngModelChange)="model.twilioAccountSID = $event" ngControl="twilioAccountSID">
            </div>
            <div class="form-group">
                <label for="twilioAuthToken">Auth Token</label>
                <input type="text" (ngModelChange)="model.twilioAuthToken = $event" ngControl="twilioAuthToken">
            </div>
            <div class="form-group">
                <label for="twilioPhone">Phone</label>
                <input type="text" (ngModelChange)="model.twilioPhone = $event" ngControl="twilioPhone">
            </div>
        
            <button type="submit">Submit</button>
        </form>
    `
})
export class ConfigFormComponent {
    model: Config = {twilioAccountSID: '', twilioAuthToken: '', twilioPhone: ''};
    
    constructor(private _configService: ConfigService) {        
    }
    
    onSubmit() {
        // this._contactsService.addContact(this.model);
    }
}