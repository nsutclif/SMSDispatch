///<reference path="../typings/browser/ambient/aws-sdk/aws-sdk.d.ts"/>
import {Injectable} from 'angular2/core';
import {Contact} from './contact';

// NOTE: I'm pretty sure this is totally not the right way to do this.
// I thought I was supposed to do this:
// import AWS = require('aws-sdk');
// ...but if I import AWS in that way and actually use it, I get an error.
// The error is the same as if I misspell aws-sdk.
// https://blog.nraboy.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var AWS: any;

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
    
    private contacts: Contact[];
    private contactsDataset: any;
    
    public getContacts(): Promise<Contact[]> {
        let self = this;

        // If there is a second call to getContactGroups() while the first call is still underway, I think we'll go
        // to the server twice. 
        // TODO: Improve.
        
        if(self.contacts) {
            return Promise.resolve(self.contacts);
        }
        else {
            return new Promise<Contact[]>((resolve,reject) => {
                self.openOrCreateDataset('Contacts').then((dataset:any) => {
                    self.contactsDataset = dataset;
                    console.log('promised dataset: ' + dataset);
                    return self.syncDataset(self.contactsDataset);
                }).then(() => {
                    self.contactsDataset.getAllRecords((error,records) => {
                        if(error) {
                            reject(error);
                        }
                        else {
                            console.log('records: ' + records);
                            //records[0].name = 'asdf';
                            //resolve(CONTACT_GROUPS);
                            
                            let loadedContacts: Contact[] = [];
                            
                            records.map((record)=> {
                                let loadedContact: Contact = JSON.parse(record.value);
                                loadedContact.phone = record.key;
                                loadedContacts.push(loadedContact);
                            });
                            
                            self.contacts = loadedContacts;
                                                        
                            resolve(loadedContacts);
                        }
                    })
                })
            })
        }
        
        //return Promise.resolve(CONTACT_GROUPS);
    }
    
    public addContact(newContact: Contact) {
        const phoneKey = newContact.phone;
        
        const recordValue: any = JSON.parse(JSON.stringify(newContact));
        delete recordValue.phone;
        
        this.contacts.push(newContact);
        
        this.contactsDataset.put(phoneKey, JSON.stringify(recordValue), (err, record)=> {
            if(err) {
                console.log('Error adding contact: ' + err);
            }
            else {
                console.log('record added.');
                this.syncDataset(this.contactsDataset);
            }
            
        });
    }
}