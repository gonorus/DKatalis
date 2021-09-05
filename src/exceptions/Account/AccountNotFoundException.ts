import BaseException from "../BaseException"

export default class AccountNotFoundException extends BaseException {
  constructor() {
    super();
    this.message = 'account not found';
  }

  public message: string;
}