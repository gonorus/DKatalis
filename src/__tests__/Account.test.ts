import Account from "../models/Account";
let newAccount: Account;

beforeEach(() => {
  newAccount = {
    Name: 'new account',
    Balanced: 0
  };
});

it('has account name', () => {
  expect(newAccount.Name).toEqual('new account');
});

it('has 0 balance', () => {
  expect(newAccount.Balanced).toEqual(0);
});
