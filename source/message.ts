export interface SMSMessage {
    id: number;
    text: string;
    date: Date;
    to: string;
    from: string;
}