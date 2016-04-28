import {Injectable} from 'angular2/core';
import {Config} from './config';
import {AWSService} from './aws.service';

@Injectable()
export class ConfigService {
    private config: Config = {twilioAccountSID: '', twilioAuthToken: '', twilioPhone: ''};
    
    public getConfig(): Promise<Config> {
        return Promise.resolve(this.config);
    }
    
    private configDataset: any;
    
    public loadConfig(): Promise<void> {
        let self = this;
        
        return new Promise<void>((resolve, reject) => {
             self._awsService.openOrCreateDataset('Config').then((dataset:any) => {
                self.configDataset = dataset;
                console.log('promised dataset: ' + dataset);
                return self._awsService.syncDataset(self.configDataset);
            }).then(() => {
                self.configDataset.getAllRecords((error,records) => {
                    if(error) {
                        reject(error);
                    }
                    else {
                        // console.log('records: ' + records);
                                                
                        records.map((record)=> {
                            self.config[record.key] = record.value;
                        });
                        
                        // console.log(self.config);
                                                    
                        resolve();
                    }
                })
            })
        })
    }
    
    public updateConfig(twilioAccountSID: string, twilioAuthToken: string, twilioPhone: string) {
        this.config.twilioAccountSID = twilioAccountSID;
        this.config.twilioAuthToken = twilioAuthToken;
        this.config.twilioPhone = twilioPhone;
        
        // TODO: DRY!
        
        this.configDataset.put('twilioAccountSID', twilioAccountSID, (err, record)=> {
            // NOTE: We're not currently waiting around for this error.
            if(err) {
                console.log(err);
            }
        });
        
        this.configDataset.put('twilioAuthToken', twilioAuthToken, (err, record)=> {
            // NOTE: We're not currently waiting around for this error.
            if(err) {
                console.log(err);
            }
        });
        
        this.configDataset.put('twilioPhone', twilioPhone, (err, record)=> {
            // NOTE: We're not currently waiting around for this error.
            if(err) {
                console.log(err);
            }
        });
    }
    
    
    constructor(private _awsService: AWSService) {

    }
}