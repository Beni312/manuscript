export class BasicResponse {
  exceptionMessage: string;
  successMessage: string;

  public withSuccessMessage(successMessage: string): BasicResponse {
    this.successMessage = successMessage;
    return this;
  }
}
