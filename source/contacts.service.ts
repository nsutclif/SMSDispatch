import {Injectable} from 'angular2/core';
import {Contact, ContactGroup} from './contact';

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
    getContactGroups() {
        return Promise.resolve(CONTACT_GROUPS);
    }
}