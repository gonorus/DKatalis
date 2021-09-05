import { program } from 'commander';
import storage from 'node-persist';
import Account from './models/Account';
import Bank from './models/Bank';

let ABC = new Bank('ABC', [], []);
const SyncBankData = async () => {
  await storage.init();
  const bankData: Bank = await storage.getItem('bank');
  if (bankData) {
    ABC = new Bank(bankData.Name, bankData.Accounts, bankData.Transactions);
  }
};
const CommitBankData = async (bank: Bank) => {
  await storage.init();
  await storage.setItem('bank', bank);
};
const PrintAccountStatement = (account: Account) => {
  const owedToTransaction = ABC.OwedToTransaction(account.Name);
  const owedFromTransaction = ABC.OwedFromTransaction(account.Name);

  console.log(`${account.Name}: your balance is $${account.Balanced}`);
  owedToTransaction.forEach(transaction => console.log(`Owed ${transaction.Balanced} to ${transaction.To}`));
  owedFromTransaction.forEach(transaction => console.log(`Owed ${transaction.Balanced} from ${transaction.From}`));
}

program.version('1.0.0');

program
  .command('login')
  .option('-name <string>', 'account name')
  .action(async (opt) => {
    await storage.init();
    await SyncBankData();
    let loggedAccount = ABC.Accounts.find(account => account.Name === opt.Name);
    if (loggedAccount === undefined) {
      loggedAccount = {
        Name: opt.Name,
        Balanced: 0
      }
      ABC.Add(loggedAccount);
      await CommitBankData(ABC);
    }

    await storage.setItem('loggedAccount', loggedAccount.Name);
    console.log(`Hello ${loggedAccount.Name}`);
    PrintAccountStatement(loggedAccount);
  });


program
  .command('deposit')
  .option('-amount <number>', 'deposit amount number into logged account')
  .action(async (opt) => {
    await storage.init();
    await SyncBankData();
    const loggedAccountName = await storage.getItem('loggedAccount');
    let loggedAccount = ABC.Accounts.find(account => account.Name === loggedAccountName);

    ABC.Deposit(loggedAccountName, Number(opt.Amount))

    if (loggedAccount) PrintAccountStatement(loggedAccount);
    await CommitBankData(ABC);
  });

program
  .command('withdraw')
  .option('-amount <number>', 'withdraw amount number from logged account')
  .action(async (opt) => {
    await storage.init();
    await SyncBankData();
    const loggedAccountName = await storage.getItem('loggedAccount');
    let loggedAccount = ABC.Accounts.find(account => account.Name === loggedAccountName);

    const withdrawResult = ABC.Withdraw(loggedAccountName, Number(opt.Amount))
    if (!withdrawResult) console.log('Sorry, your withdrawal request can not being process');

    if (loggedAccount) PrintAccountStatement(loggedAccount);
    await CommitBankData(ABC);
  });

program
  .command('transfer')
  .option('-target <string>', 'transfer amount number target account')
  .option('-amount <number>', 'transfer amount number from logged account')
  .action(async (opt) => {
    await storage.init();
    await SyncBankData();
    const loggedAccountName = await storage.getItem('loggedAccount');
    let loggedAccount = ABC.Accounts.find(account => account.Name === loggedAccountName);

    try {
      ABC.Transfer(loggedAccountName, opt.Target, Number(opt.Amount))
    }
    catch (AccountNotFoundException) {
      console.log(`target account = ${opt.Target} is not found`);
    } finally {
      if (loggedAccount) PrintAccountStatement(loggedAccount);
      await CommitBankData(ABC);
    }
  });

program
  .command('logout')
  .action(async () => {
    await storage.init();
    const loggedAccount = await storage.getItem('loggedAccount');
    console.log(`Goodbye, ${loggedAccount}`);
    await storage.setItem('loggedAccount', null);
  });
program.parse(process.argv);