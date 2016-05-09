///<reference path="../typings/browser/ambient/aws-sdk/aws-sdk.d.ts"/>
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
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
    contacts$: Observable<Contact[]>;
    contactGroups$: Observable<ContactGroup[]>;
    private _contactsObserver: Observer<Contact[]>;
    private _contactGroupsObserver: Observer<ContactGroup[]>;
    private _dataStore: {
        contacts: Contact[];
        contactGroups: ContactGroup[];
    }
    
    private contactsDataset: any;
    
    constructor(private _awsService: AWSService) {
        this._dataStore = {
            contacts: [], 
            contactGroups: []
        };
        this.contacts$ = new Observable<Contact[]>((observer) => {
            this._contactsObserver = observer;
            this.changedDataStore(); // give the observer the current copy.
        });
        this.contactGroups$ = new Observable<ContactGroup[]>((observer) => {
            this._contactGroupsObserver = observer;
            this.changedDataStore(); // give the observer the current copy.
        });
    }
    
    private changedDataStore() {
        this.buildContactGroups();
        if (this._contactsObserver) {
            this._contactsObserver.next(this._dataStore.contacts);
        }
        if (this._contactGroupsObserver) {
            this._contactGroupsObserver.next(this._dataStore.contactGroups);
        }
    }
    
    public stripPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/[^0-9]+/g, '');
    }
    
    private buildContactGroups() {
        let groupMap = new Map();
        
        this._dataStore.contacts.map((contact: Contact)=>{
            let contactGroup: ContactGroup = <ContactGroup>groupMap.get(contact.group);
            if (!contactGroup) {
                contactGroup = {name: contact.group, contacts: [contact]};
                groupMap.set(contact.group, contactGroup);
            }
            else {
                contactGroup.contacts.push(contact);
            }
        });
        
        this._dataStore.contactGroups = [];
        groupMap.forEach((value: ContactGroup)=> {
            this._dataStore.contactGroups.push(value);
        });
        
        // also sort the contacts:
        this._dataStore.contacts.sort((a: Contact, b: Contact): number => {
            let result =  a.group.localeCompare(b.group);
            
            if (result === 0) {
                result = a.name.localeCompare(b.name);
            }
            
            return result;
        });
    }
    
    public getContactGroup(groupName: string): ContactGroup {
        for (var i=0; i < this._dataStore.contactGroups.length; i++) {
            if (this._dataStore.contactGroups[i].name === groupName) {
                return this._dataStore.contactGroups[i];
            }
        }
    }
    
    public loadContacts() {
        let self = this;
        
        self._awsService.openOrCreateDataset('Contacts').then((dataset:any) => {
            self.contactsDataset = dataset;
            // console.log('promised contacts dataset: ' + dataset);
            return self._awsService.syncDataset(self.contactsDataset);
        }).then(() => {
            self.contactsDataset.getAllRecords((error,records) => {
                if(error) {
                    console.log('error getting records: ' + error);
                }
                else {
                    console.log('records: ' + records);
                    
                    self._dataStore.contacts = [];
                    
                    records.map((record)=> {
                        // Records with blank values are marked for deletion.  
                        // Supposedly they will eventually go away when they get synced with Amazon...
                        if (record.value) {
                            try {
                                let loadedContact: Contact = JSON.parse(record.value);
                                loadedContact.phone = record.key;
                                self._dataStore.contacts.push(loadedContact);            
                            } catch (error) {
                                console.log('error loading record: ' + record + ': ' + error);
                            }
                        }
                    });
                    
                    self.changedDataStore();                            
                }
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
        
                this._dataStore.contacts.push(clonedContact);
                this.changedDataStore();
            }
            
        });
    }
    
    public deleteContact(contact: Contact) {
        let contactIndex = this._dataStore.contacts.indexOf(contact);
        this.contactsDataset.remove(contact.phone, (err, record)=> {
            if(err) {
                console.log('Error deleting contact: ' + err);
            }
            else {
                console.log('record deleted.');
                this._dataStore.contacts.splice(contactIndex, 1);
                this.changedDataStore();
                this._awsService.syncDataset(this.contactsDataset);
            }
        });
    }
    
    private comparePhonesApprox(phoneA: string, phoneB: string): boolean {
        let compareA = this.stripPhoneNumber(phoneA);
        let compareB = this.stripPhoneNumber(phoneB);
        
        // make sure compareA is the longest string.
        if (compareB.length > compareA.length) {
            let swap = compareA;
            compareA = compareB;
            compareB = swap;
        }
        
        // special case: if the longest string starts with 1 and is one character longer,
        // remove the 1.
        if ((compareA.length === compareB.length + 1) && compareA[0] === '1') {
            compareA = compareA.slice(1);
        }
        
        return compareA === compareB;
    }
    
    public getContactByPhoneApprox(phone: string): Contact {
        if (phone) {
            for (var i=0; i < this._dataStore.contacts.length; i++) {
                if (this.comparePhonesApprox(this._dataStore.contacts[i].phone, phone)) {
                    return this._dataStore.contacts[i];
                }
            }
        }        
    }
}