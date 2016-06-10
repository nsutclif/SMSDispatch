import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/common';
import {Config} from './config';
import {ConfigService} from './config.service';


@Component({
    selector: 'config-form',
    template: `
        <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="twilioAccountSID">Account SID</label>
              <input type="text" class="form-control" [(ngModel)]="model.twilioAccountSID" ngControl="twilioAccountSID" placeholder="Account SID">
            </div>
            <div class="form-group">
                <label for="twilioAuthToken">Auth Token</label>
                <input type="text" class="form-control" [(ngModel)]="model.twilioAuthToken" ngControl="twilioAuthToken" placeholder="Auth Token">
            </div>
            <div class="form-group">
                <label for="twilioPhone">Phone</label>
                <input type="text" class="form-control" [(ngModel)]="model.twilioPhone" ngControl="twilioPhone" placeholder="Phone">
            </div>
        
            <button type="submit" class="btn btn-default">Update</button>
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