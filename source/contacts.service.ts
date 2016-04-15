///<reference path="../typings/browser/ambient/aws-sdk/aws-sdk.d.ts"/>
import {Injectable} from 'angular2/core';
import {Contact, ContactGroup} from './contact';
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
    
    private contacts: Contact[] = [];
    private contactGroups: ContactGroup[];
    private contactsDataset: any;
    
    public getContacts(): Promise<Contact[]> {
        return Promise.resolve(this.contacts);
    }
    
    private buildContactGroups() {
        let groupMap = new Map();
        
        this.contacts.map((contact: Contact)=>{
            let contactGroup: ContactGroup = <ContactGroup>groupMap.get(contact.group);
            if (!contactGroup) {
                contactGroup = {name: contact.group, contacts: [contact]};
                groupMap.set(contact.group, contactGroup);
            }
            else {
                contactGroup.contacts.push(contact);
            }
        });
        
        this.contactGroups = [];
        groupMap.forEach((value: ContactGroup)=> {
            this.contactGroups.push(value);
        });
    }
    
    public getContactGroups(): ContactGroup[] {
        return this.contactGroups;
    }
    
    public loadContacts(): Promise<void> {
        let self = this;
        
        return new Promise<void>((resolve,reject) => {
            self._awsService.openOrCreateDataset('Contacts').then((dataset:any) => {
                self.contactsDataset = dataset;
                console.log('promised contacts dataset: ' + dataset);
                return self._awsService.syncDataset(self.contactsDataset);
            }).then(() => {
                self.contactsDataset.getAllRecords((error,records) => {
                    if(error) {
                        console.log('rejected: ' + error);
                        reject(error);
                    }
                    else {
                        console.log('records: ' + records);
                        
                        self.contacts.length = 0;
                        
                        records.map((record)=> {
                            // Records with blank values are marked for deletion.  
                            // Supposedly they will eventually go away when they get synced with Amazon...
                            if (record.value) {
                                try {
                                    let loadedContact: Contact = JSON.parse(record.value);
                                    loadedContact.phone = record.key;
                                    self.contacts.push(loadedContact);                                
                                } catch (error) {
                                    console.log('error loading record: ' + record + ': ' + error);
                                }
                            }
                        });
                        
                        self.buildContactGroups();                            
                        resolve();
                    }
                })
            })
        })
    }
    
    public addContact(newContact: Contact) {
        const phoneKey = newContact.phone;
        
        const recordValue: any = JSON.parse(JSON.stringify(newContact));
        delete recordValue.phone;
        
        let clonedContact: Contact = JSON.parse(JSON.stringify(newContact));
        
        this.contactsDataset.put(phoneKey, JSON.stringify(recordValue), (err, record)=> {
            if(err) {
                console.log('Error adding contact: ' + err);
            }
            else {
                console.log('record added.');
                this._awsService.syncDataset(this.contactsDataset);
        
                this.contacts.push(clonedContact);
                this.buildContactGroups();
            }
            
        });
    }
    
    public deleteContact(contact: Contact) {
        let contactIndex = this.contacts.indexOf(contact);
        this.contactsDataset.remove(contact.phone, (err, record)=> {
            if(err) {
                console.log('Error deleting contact: ' + err);
            }
            else {
                console.log('record deleted.');
                this.contacts.splice(contactIndex, 1);
                this.buildContactGroups();
                this._awsService.syncDataset(this.contactsDataset);
            }
        });
    }
    
    constructor(private _awsService: AWSService) {

    }
}