import Account from "../../models/Account";
import BaseException from "../BaseException"

export default class AccountBalanceException extends BaseException {
  constructor(args: Account) {
    super(args);
    this.message = 'account balance exceptions. the account balance may not be enough.';
  }

  public message: string;
}