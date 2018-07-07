## Synopsis

This web application was developed to help you to keep track of your expenses and bank transactions.

Below are some of the features in the app.

- It has graphics to visualise your annual, monthly incomes and outcomes.
- It has responsive design, which means you can use the app in any device of your choice.
- Ability to make custom search from your transactions and expenses.


## Installation

To run the application at your computer, make sure you have Nodejs installed. Download can be found here: https://nodejs.org/en/

The database used withing the app is Mysql. So, make sure it's installed at your personal computer. More about Mysql, can be found here: https://www.mysql.com

- Download the folder `finance-angular`.
- Before running the app, we need to install some packages, open the terminal and type: 
```
npm install
```
- Next, to build our Front-End app, we run the command line: 
```
npm run build
```
- Last step, we start our app with the command line: 
```
npm start
```

or to run the app with PM2, type the follow:

To run PM2 restart:
```
npm run-script pm2-restart
```

To run PM2 stop:
```
npm run-script pm2-stop
```


## Tests

To run our test we have following commands:

Back-End test: 
```
npm run-script test:server
```

Front-End test: 
```
npm run-script test:client
```

## License

**ISC**