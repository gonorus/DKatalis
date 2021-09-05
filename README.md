# Prequisites:
- [Node JS](https://nodejs.org/en/download/)
- [VS Code](https://code.visualstudio.com/download)

# Step by Step to Run
1. extract the project
2. use CLI tools on root project directory
3. use npm install or yarn

# Available Commands
[x] `login [name]` - Logs in as this customer and creates the customer if not exist
## example
> yarn start login gonorus
## example output
```
Hello gonorus
gonorus: your balance is $100
Done in 2.24s.
```

[x] `deposit [amount]` - Deposits this amount to the logged in customer
## example
> yarn start deposit -amount 150
## example output
```
gonorus: your balance is $250
Done in 2.20s.
```

[x] `withdraw [amount]` - Withdraws this amount from the logged in customer
## example
> yarn start withdraw -amount 150
## example output
```
gonorus: your balance is $250
Done in 2.20s.
```

[x] `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer
## example
> yarn start transfer -target dwi -amount 150
## example output
```
gonorus: your balance is $0
Owed 50 to dwi
Done in 2.23s.
```

[x] `logout` - Logs out of the current customer
## example
> yarn start logout
## example output
```
Goodbye, gonorus
Done in 2.21s.
```