import AccountCreationException from "../exceptions/Account/AccountCreationException";
import AccountNotFoundException from "../exceptions/Account/AccountNotFoundException";
import Account from "./Account";
import Transaction, { TransactionStatus } from "./Transaction";

export default class Bank {
  constructor(
    /**
     * Name of the bank
     */
    readonly Name: string,
    /**
     * Registered Account on the bank
     */
    readonly Accounts: Array<Account>,
    /**
     * List of transactin between Bank Account
     */
    readonly Transactions: Array<Transaction>,
  ) { }

  /**
   * Registering new Bank Account
   * @param Account new account
   */
  public Add(newAaccount: Account): void {
    if (!this.Accounts.some(account => account.Name === newAaccount.Name)) {
      this.Accounts.push(newAaccount);
      return;
    }
    throw new AccountCreationException(newAaccount);
  }

  /**
   * Move the balance between Bank Account
   * @param from balance source account name
   * @param to balance target account name
   * @param amount number of balance
   * @returns return true if the transaction was succeed or return false if the transaction status was pending
   */
  public Transfer(from: string, to: string, amount: number): TransactionStatus {
    const filterAccount = this.Accounts.filter(account => account.Name === from || account.Name === to);
    const srcAccount = filterAccount.find(account => account.Name === from);
    const targetAccount = filterAccount.find(account => account.Name === to);

    if (targetAccount === null || targetAccount === undefined) {
      throw new AccountNotFoundException();
    }

    const date = new Date();
    const newTransaction: Transaction = {
      CreatedDate: date,
      UpdatedDate: date,
      From: from,
      To: to,
      Balanced: amount,
      Status: TransactionStatus.SUCCESS
    }
    if (srcAccount) {
      const newSeparateTransaction: Transaction = {
        CreatedDate: date,
        UpdatedDate: date,
        From: from,
        To: to,
        Balanced: srcAccount.Balanced,
        Status: TransactionStatus.SUCCESS
      }

      if (srcAccount.Balanced < amount) {
        newTransaction.Balanced = amount - srcAccount.Balanced;
        newTransaction.Status = TransactionStatus.PENDING;

        this.Transactions.push(newSeparateTransaction);
        targetAccount.Balanced += srcAccount.Balanced;
        srcAccount.Balanced = 0;
      }
      else {
        srcAccount.Balanced -= amount;
        targetAccount.Balanced += amount;
      }
    }
    this.Transactions.push(newTransaction);
    return newTransaction.Status;
  }

  /**
   * Add balance into Bank Account
   * @param accountName balance target account name
   * @param amount added balanced
   */
  public Deposit(accountName: string, amount: number): void {
    const srcAccount = this.Accounts.find(account => account.Name === accountName);
    const srcPendingTransaction = this.Transactions.filter(transaction => transaction.From === accountName && transaction.Status === TransactionStatus.PENDING);
    const date = new Date();

    if (srcAccount && amount > 0) {
      const depositTransaction: Transaction = {
        CreatedDate: date,
        UpdatedDate: date,
        From: accountName,
        To: null,
        Balanced: amount,
        Status: TransactionStatus.SUCCESS
      }
      this.Transactions.push(depositTransaction);

      srcAccount.Balanced = srcAccount.Balanced + amount;
      srcPendingTransaction.forEach(transaction => {
        if (amount > 0) {
          const currentDate = date;
          transaction.UpdatedDate = currentDate;
          transaction.Status = TransactionStatus.SUCCESS;

          this.Transfer(transaction.From!, transaction.To!, transaction.Balanced);
          amount -= transaction.Balanced;
        }
      });
    }
  }

  /**
   * Take balance from Bank Account
   * @param accountName balance source account name
   * @param amount number of balance
   * @returns return true if the transaction was succeed or return false if the transaction can not be completed
   */
  public Withdraw(accountName: string, amount: number): boolean {
    const srcAccount = this.Accounts.find(account => account.Name === accountName);
    if (srcAccount && amount > 0 && srcAccount.Balanced >= amount) {
      srcAccount.Balanced = srcAccount.Balanced - amount;

      const date = new Date();
      const withdrawTransaction: Transaction = {
        CreatedDate: date,
        UpdatedDate: date,
        From: null,
        To: accountName,
        Balanced: amount,
        Status: TransactionStatus.SUCCESS
      }
      this.Transactions.push(withdrawTransaction);
      return true;
    }

    return false;
  }
};