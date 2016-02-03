export interface Contact {
    id: number;
    name: string;
    phone: string;
}

export interface ContactGroup {
    id: number;
    name: string;
    contacts: Contact[];
}