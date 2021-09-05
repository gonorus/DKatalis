import Account from "../../models/Account";
import BaseException from "../BaseException"

export default class AccountCreationException extends BaseException {
  constructor(args: Account) {
    super(args);
    this.message = 'can not create account';
  }

  public message: string;
}