import AccountBalanceException from '../exceptions/Account/AccountBalanceException';
import AccountCreationException from '../exceptions/Account/AccountCreationException';
import AccountNotFoundException from '../exceptions/Account/AccountNotFoundException';
import Account from '../models/Account';
import Bank from "../models/Bank";
import { TransactionStatus } from '../models/Transaction';

describe('Bank App Account', () => {
  let ABC: Bank;

  beforeEach(() => {
    ABC = new Bank('ABC', [], []);
  });

  it('should add new account', () => {
    const newAccount: Account = {
      Name: 'new account',
      Balanced: 0
    };
    ABC.Add(newAccount);
    expect(ABC.Accounts.length).toEqual(1);
  });

  it(`should throw ${AccountCreationException}`, () => {
    const newAccount: Account = {
      Name: 'new account',
      Balanced: 0
    };
    ABC.Add(newAccount);
    expect(() => ABC.Add(newAccount)).toThrow(AccountCreationException);
  });

  it(`should throw ${AccountNotFoundException} on transfer`, () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 0
    };
    ABC.Add(srcAccount);
    expect(() => ABC.Transfer(srcAccount.Name, 'target account', 10)).toThrow(AccountNotFoundException);
  });

  it('should increase account balance on deposit', () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 50
    };
    ABC.Add(srcAccount);
    ABC.Deposit(srcAccount.Name, 10);
    expect(srcAccount.Balanced).toEqual(60);
  });

  it('should return true on withdraw', () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 50
    };
    ABC.Add(srcAccount);
    const withdrawStatus = ABC.Withdraw(srcAccount.Name, 10);
    expect(withdrawStatus).toEqual(true);
  });

  it('should return false on withdraw', () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 0
    };
    ABC.Add(srcAccount);
    const withdrawStatus = ABC.Withdraw(srcAccount.Name, 10);
    expect(withdrawStatus).toEqual(false);
  });
});

describe('Bank App Transaction', () => {
  let ABC: Bank;

  beforeEach(() => {
    ABC = new Bank('ABC', [], []);
  });

  it(`should return ${TransactionStatus.PENDING} when source balance less than amount`, () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 0
    };
    const targetAccount: Account = {
      Name: 'target account',
      Balanced: 0
    };
    ABC.Add(srcAccount);
    ABC.Add(targetAccount);
    
    const transactionStatus = ABC.Transfer(srcAccount.Name, targetAccount.Name, 10);
    expect(transactionStatus).toEqual(TransactionStatus.PENDING);
  });


  it('should not increase account balance on deposit', () => {
    const srcAccount: Account = {
      Name: 'source account',
      Balanced: 50
    };
    const targetAccount: Account = {
      Name: 'target account',
      Balanced: 50
    };
    ABC.Add(srcAccount);
    ABC.Add(targetAccount);

    const transactionStatus = ABC.Transfer(srcAccount.Name, targetAccount.Name, 100);
    expect(transactionStatus).toEqual(TransactionStatus.PENDING);

    ABC.Deposit(srcAccount.Name, 50);
    expect(srcAccount.Balanced).toEqual(0);
    expect(targetAccount.Balanced).toEqual(150);
  });
});