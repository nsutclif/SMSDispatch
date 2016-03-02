///<reference path="../typings/browser/ambient/aws-sdk/aws-sdk.d.ts"/>
import {Injectable} from 'angular2/core';
import {Contact} from './contact';
import {AWSService} from './aws.service';

// NOTE: I'm pretty sure this is totally not the right way to do this.
// I thought I was supposed to do this:
// import AWS = require('aws-sdk');
// ...but if I import AWS in that way and actually use it, I get an error.
// The error is the same as if I misspell aws-sdk.
// https://blog.nraboy.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var AWS: any;

@Injectable()
export class ContactsService {
    
    private contacts: Contact[];
    private contactsDataset: any;
    
    public getContacts(): Promise<Contact[]> {
        return Promise.resolve(this.contacts);
    }
    
    public loadContacts(): Promise<void> {
        let self = this;

        // If there is a second call to getContactGroups() while the first call is still underway, I think we'll go
        // to the server twice. 
        // TODO: Improve.
        
        return new Promise<void>((resolve,reject) => {
            self._awsService.openOrCreateDataset('Contacts').then((dataset:any) => {
                self.contactsDataset = dataset;
                console.log('promised dataset: ' + dataset);
                return self._awsService.syncDataset(self.contactsDataset);
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
                                                    
                        resolve();
                    }
                })
            })
        })
        
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
                this._awsService.syncDataset(this.contactsDataset);
            }
            
        });
    }
    
    constructor(private _awsService: AWSService) {

    }
}