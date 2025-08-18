const Amount = document.getElementById("amount");
const People = document.getElementById("people");
const Vat = document.getElementById("vat");
const CheckForm = document.querySelector(".check-form");
const Btn = document.querySelector(".check-btn");
const Result = document.querySelector(".result-content");


const createCard = (vatAmount, amount, totalPerPerson, vatPerPerson, totalPerPersonWithVat, people, vatPercentage) => {
  Result.innerHTML = ""; 
  
  Result.innerHTML += 
    `<div class="card">
      <p class="receipt-text">Number of People: <span class="number-of-people">${people}</span></p>
      <p class="result-text">Amount: <span class="total-amount">${amount}</span></p>
      <p class="result-text">Per Person: <span class="total-per-person">${totalPerPerson}</span></p>
      <p class="receipt-text">VAT Percentage: <span class="tip-percentage">${vatPercentage+"%"}</span></p>
      <p class="result-text">VAT Amount: <span class="tip-amount">${vatAmount}</span></p>
      <p class="result-text">VAT Per Person: <span class="tip-per-person">${vatPerPerson}</span></p>
      <hr/>
      <p class="result-text">Total Per Person with VAT: <span class="total-per-person-with-tip">${totalPerPersonWithVat}</span></p>
    </div>`
}

CheckForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(Amount.value);
  const people = parseInt(People.value);
  const vatPercentage = parseFloat(Vat.value) || 0;

  const vatAmount = (amount * vatPercentage) / 100;
  const totalPerPerson = amount / people;
  const vatPerPerson = vatAmount / people;
  const totalPerPersonWithVat = totalPerPerson + vatPerPerson;

  createCard(vatAmount, amount, totalPerPerson, vatPerPerson, totalPerPersonWithVat, people, vatPercentage)
});