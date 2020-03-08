import { Author } from './author';

export class ConferenceSubmission {
  id: number;
  title: string;
  status: string;
  submitter: Author;
  conferenceId: number;

  constructor(id: number, title: string, status: string, submitter: Author, conferenceId: number) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.submitter = submitter;
    this.conferenceId = conferenceId;
  }
}
