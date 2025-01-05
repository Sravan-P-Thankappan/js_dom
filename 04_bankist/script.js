
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-11-03T17:01:17.194Z',
    '2024-11-07T23:36:17.929Z',
    '2024-11-08T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

let sort = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


const formatDate = (date) => {
  const calcDayPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const dayPassed = calcDayPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  const year = date.getFullYear();
  const month = `${date.getMonth()}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  return `${day}/${month}/${year}`;
}


const displayMovements = function (acc, sort = false) {

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);
    const type = mov > 1 ? 'deposit' : 'withdrawal';
    const hml = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov} EUR</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', hml);
  });
}

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {

  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance.toLocaleString();
  labelBalance.textContent = acc.balance + " EUR";
}

// calcDisplayBalance(account1.movements);



const calcDisplaySummary = function (acc) {

  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((ac, mov) => ac + mov);

  labelSumIn.textContent = income + " EUR";

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((ac, mov) => ac + mov);

  labelSumOut.textContent = Math.abs(out) + " EUR";

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((intrest) => intrest > 1)
    .reduce((ac, int) => ac + int);

  labelSumInterest.textContent = interest + " EUR"

}

// calcDisplaySummary(account1.movements);

const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUserName(accounts);


const startLogoutTimer = () => {
  let time = 30;
  const tick = () => {
    const minute = String(Math.trunc(time / 60)).padStart(2, '0');
    const second = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${minute}:${second}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}


// Login
let currentAccount = null, timer;

const updateUi = function () {
  // Display Movements.
  displayMovements(currentAccount);

  // Display Balance.
  calcDisplayBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);
}

// currentAccount = account1;
// updateUi()
// containerApp.style.opacity = 1;




btnLogin.addEventListener('click', (e) => {

  e.preventDefault();

  currentAccount = accounts.find((account) => account.userName === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // creating date
    /* const now = new Date();
     const year = now.getFullYear();
     const month = `${now.getMonth()}`.padStart(2, 0);
     const date = `${now.getDate()}`.padStart(2, 0);
     const hour = now.getHours();
     const minute = now.getMinutes();
     labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`; */

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }

    const locale = navigator.language // 'en-US' like this language-Country

    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    updateUi(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  }

});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAc = accounts.find((ac) => ac.userName === inputTransferTo.value);

  currentAccount.movements.push(-amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAc.movements.push(amount);
  receiverAc.movementsDates.push(new Date().toISOString());

  inputTransferAmount.value = inputTransferTo.value = ''
  inputTransferAmount.blur();

  if (amount > 0 && receiverAc && currentAccount.balance > amount && receiverAc.userName !== currentAccount.userName)
    updateUi(currentAccount);

});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      inputLoanAmount.blur();
      updateUi();
    }, 2500)
    inputLoanAmount.value = '';
  }


});

btnClose.addEventListener('click', (e) => {

  e.preventDefault();
  console.log(inputCloseUsername.value, inputClosePin.value)
  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex((ac) => ac.userName === currentAccount.userName);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }

});


btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort
});

// const max = movements.reduce((ac, el) => {
//   if (el > ac) return el;
//   else return ac;
// }, movements[0]);

// console.log(max);


