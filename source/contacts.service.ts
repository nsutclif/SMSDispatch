///<reference path="../typings/browser/ambient/aws-sdk/aws-sdk.d.ts"/>
import {Injectable} from 'angular2/core';
import {Contact, ContactGroup} from './contact';

// NOTE: I'm pretty sure this is totally not the right way to do this.
// I thought I was supposed to do this:
// import AWS = require('aws-sdk');
// ...but if I import AWS in that way and actually use it, I get an error.
// The error is the same as if I misspell aws-sdk.
// https://blog.nraboy.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var AWS: any;

const CONTACT_GROUPS: ContactGroup[] = [
    {"id": 1, "name": "Organizers", "contacts": [
        {"id": 1, "name": "Terry", "phone": "555-555-1111"},
        {"id": 2, "name": "Mary", "phone": "555-555-1112"}
        ]},
    {"id": 1, "name": "Volunteers", "contacts": [
        {"id": 3, "name": "Barry", "phone": "555-555-1113"},
        {"id": 4, "name": "Perry", "phone": "555-555-1114"},
        {"id": 5, "name": "Carry", "phone": "555-555-1115"},
        {"id": 6, "name": "Fairy", "phone": "555-555-1116"},
        {"id": 7, "name": "Harry", "phone": "555-555-1117"},
        {"id": 8, "name": "Sherry", "phone": "555-555-1118"},
        {"id": 9, "name": "Lary", "phone": "555-555-1119"}
        ]}
] 

@Injectable()
export class ContactsService {
    // TODO: Define some types for this thing:    
    private syncClient: any;
    
    private getSyncClient(service: ContactsService): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (service.syncClient) {
                resolve(service.syncClient);
            }
            else {
                
                // LEFT OFF HERE.  AWS.config.credentials is still null here.

                if (!AWS.config.credentials) {
                    reject(new Error('Not logged into AWS.'));
                }
                else {                
                    AWS.config.credentials.get(() => {
                        service.syncClient = new AWS.CognitoSyncManager();
                        resolve(service.syncClient); 
                    });
                }
            }
        });
    }
        
    private openOrCreateDataset(datasetName: string): Promise<any> {
        return this.getSyncClient(this).then((syncClient: any) => {
            return new Promise<any>((resolve,reject) => {
                syncClient.openOrCreateDataset(datasetName, (err, dataset: any) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(dataset);
                    }
                });
            });
        });
    }
    
    private syncDataset(dataset: any): Promise<void> {        
        return new Promise<void>((resolve,reject) => {
            dataset.synchronize(
                {
                    onSuccess: (dataset, updates) => {
                        console.log('synchronized.'); 
                        resolve();
                    },
                    onFailure: (err) => {
                        reject(err);
                    }
                    // TODO: Write an onConflict handler.
                }, 
                false);
        });
    }
    
    getContactGroups(): Promise<ContactGroup[]> {
        let contactsDataset: any;
        let self = this;
        
        this.openOrCreateDataset('TestDataset').then((dataset:any) => {
            contactsDataset = dataset;
            console.log('promised dataset: ' + dataset);
            return self.syncDataset(contactsDataset);
        }).then(() => {
            return new Promise<void>((resolve,reject) => {
                contactsDataset.getAllRecords((error,records) => {
                    if(error) {
                        reject(error);
                    }
                    else {
                        console.log('records: ' + records);
                        resolve();
                    }
                });
            })
        }).catch((reason) => {
            console.log('rejected: ' + reason);
        });
        
        return Promise.resolve(CONTACT_GROUPS);
    }
}