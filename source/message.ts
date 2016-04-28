import {Contact} from './contact';

export interface SMSMessage {
    id: string;
    text: string;
    date: Date;
    to: string;
    from: string;
    outgoing: boolean;
    contact: Contact;
}