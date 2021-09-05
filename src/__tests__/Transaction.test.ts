import Transaction, { TransactionStatus } from '../models/Transaction';
let newTransaction: Transaction;

beforeEach(() => {
  const date = new Date();
  newTransaction = {
    CreatedDate: date,
    UpdatedDate: date,
    From: 'new account',
    To: 'new account',
    Balanced: 5000,
    Status: TransactionStatus.SUCCESS
  };
});

it(`has not ${TransactionStatus.SUCCESS} transaction`, () => {
  expect(newTransaction.Status).toEqual(TransactionStatus.SUCCESS);
});

it(`has not ${TransactionStatus.PENDING} transaction`, () => {
  expect(newTransaction.Status).not.toEqual(TransactionStatus.PENDING);
});