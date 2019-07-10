export class BaseError implements Error {

  public message: string;
  public status: number;
  public name: string;

  constructor(message: string, status: number, name: string) {
    this.message = message;
    this.status = status;
    this.name = name;
  }
}
