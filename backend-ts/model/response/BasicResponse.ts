export class BasicResponse {
  exceptionMessage: string;
  successMessage: string;

  public withSuccessMessage(successMessage: string): BasicResponse {
    this.successMessage = successMessage;
    return this;
  }

  public withExceptionMessage(exceptionMessage: string): BasicResponse {
    this.exceptionMessage = exceptionMessage;
    return this;
  }
}
