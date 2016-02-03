export interface SMSMessage {
    id: number;
    text: string;
    date: Date;
    senderID: number;
    recipientID: number;
}