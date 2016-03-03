import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Config} from './config';
import {ConfigService} from './config.service';


@Component({
    selector: 'config-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="twilioAccountSID">Account SID</label>
              <input type="text" [(ngModel)]="model.twilioAccountSID" ngControl="twilioAccountSID">
            </div>
            <div class="form-group">
                <label for="twilioAuthToken">Auth Token</label>
                <input type="text" [(ngModel)]="model.twilioAuthToken" ngControl="twilioAuthToken">
            </div>
            <div class="form-group">
                <label for="twilioPhone">Phone</label>
                <input type="text" [(ngModel)]="model.twilioPhone" ngControl="twilioPhone">
            </div>
        
            <button type="submit">Update</button>
        </form>
    `
})
export class ConfigFormComponent implements OnInit {
    model: Config = {twilioAccountSID: '', twilioAuthToken: '', twilioPhone: ''};
    
    constructor(private _configService: ConfigService) {        
    }
    
    onSubmit() {
        this._configService.updateConfig(this.model.twilioAccountSID, this.model.twilioAuthToken, this.model.twilioPhone);
    }
    
    resetModel() {
        let self = this;
        
        self._configService.getConfig().then(config => {
            // make a copy of the config for this form.
            self.model = JSON.parse(JSON.stringify(config));
        })
    }
    
    ngOnInit() {
        this.resetModel();
    }
}