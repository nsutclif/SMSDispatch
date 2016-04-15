export interface Contact {
    phone: string;
    name: string;
    group: string;
    leader: boolean;
}

export interface ContactGroup {
    name: string;
    contacts: Contact[];
}