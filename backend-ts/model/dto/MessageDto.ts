export class MessageDto {
  to: number;
  message: string;
  sentDate: Date;
  incoming: boolean;
  seen: boolean;

  constructor(to: number, message: string, sentDate: Date, incoming: boolean, seen: boolean) {
    this.to = to;
    this.message = message;
    this.sentDate = sentDate;
    this.incoming = incoming;
    this.seen = seen;
  }
}
