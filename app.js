const Vat = document.getElementById("vat");
const CheckForm = document.querySelector(".check-form");
const Btn = document.querySelector(".check-btn");
const Result = document.querySelector(".result-content");
const AddItemBtn = document.querySelector(".add-item-btn");
const AddedItemContainer = document.querySelector(".added-item-container");

// add a new item
AddItemBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const newItem = document.createElement('div');
  newItem.classList.add('form-container'); 

  
  newItem.innerHTML = `
    <hr/>
    <input type="text" class="check-input" placeholder="Enter another meal" required/>
    <input type="number" class="check-input" placeholder="Total Amount" required/>
    <input type="number" class="check-input" placeholder="Number of People" required/>
    <button class="remove-item-btn">
      <i class="fa-solid fa-trash"></i>
      Remove Item
    </button>
  `;
  AddedItemContainer.appendChild(newItem);
});

//Remove button functionality
CheckForm.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-item-btn");
    if (removeBtn) {
        e.preventDefault();
        const itemContainer = removeBtn.closest(".form-container");
        if (itemContainer) {
            itemContainer.remove();
        }
    }
});

// Function to create and display the card with results
const createCard = (items, totalAmount, vatAmount, totalWithVat, vatPercentage, VatPerPerson) => {
  Result.innerHTML = ""; // Clear previous results

  //create HTML for each item we added
  let itemsHtml = items.map(item => `
    <p class="result-text" style="font-weight: bold;">${item.name}</p>
    <div style="padding-left: 15px; margin-bottom: 10px;">
      <p class="result-text">Amount: <span>${item.amount.toFixed(2)}</span></p>
      <p class="result-text">Split by: <span>${item.people}</span></p>
      <p class="result-text">Per Person: <span>${item.perPerson.toFixed(2)}</span></p>
    </div>
  `).join('<hr style="border-style: dashed; border-color: #ccc; margin: 5px 0;">');

  // Create the final HTML for the card and insert it into the result container
  Result.innerHTML = `
    <div class="card">
      <h4 style="text-align: center; margin-bottom: 15px;">Receipt Summary</h4>
      ${itemsHtml}
      <hr/>
      <p class="result-text">Subtotal: <span>${totalAmount.toFixed(2)}</span></p>
      <p class="result-text">VAT (${vatPercentage}%): <span>${vatAmount.toFixed(2)}</span></p>
      <p class="result-text">VAT per Person: <span>${VatPerPerson.toFixed(2)}</span></p>
      <hr/>
      <p class="result-text" style="font-size: 1.1rem;"><b>Total:</b> <span><b>${totalWithVat.toFixed(2)}</b></span></p>
    </div>
  `;
}

// Event listener for the main button to calculate and display results
Btn.addEventListener("click", (e) => {
  e.preventDefault();

  const allItemForms = document.querySelectorAll(".check-form .form-container");
  let items = []; // Array to hold item details
  let totalAmount = 0; //initial total amount
  let hasErrors = false; // Flag to check for input errors

  // Loop through each item form to gather data
  allItemForms.forEach(formContainer => {
    const mealInput = formContainer.querySelector('input[placeholder*="meal"]');
    const amountInput = formContainer.querySelector('input[placeholder="Total Amount"]');
    const peopleInput = formContainer.querySelector('input[placeholder="Number of People"]');
    // Check if the inputs not empty
    if (!mealInput || !amountInput || !peopleInput) {
        return; 
    }
    // Get the values from the inputs
    const mealName = mealInput.value.trim(); // Trim whitespace from meal name
    const amount = parseFloat(amountInput.value); // Convert amount to a number in float format
    const people = parseInt(peopleInput.value); // Convert people to an integer number

    // Validate the inputs
    if (mealName === "" || isNaN(amount) || isNaN(people) || amount <= 0 || people <= 0) {
      // Ignore newly added blank forms, but flag an error if it's the only entry
      if (allItemForms.length > 1 && mealName === "" && isNaN(amount) && isNaN(people)) {
        // This is a blank, newly added form. Ignore it.
      } else {
        hasErrors = true; // Set the error flag if any input is invalid
      }
      return; 
    }

    // Add the item's amount to the total and store its details
    totalAmount += amount;
    items.push({
      name: mealName,
      amount: amount,
      people: people,
      perPerson: amount / people,
    });
  });
  // Check if there are any errors or if no items were added 
  if (hasErrors || items.length === 0) {
    alert("Please fill in all fields with valid numbers. Amount and people must be greater than 0.");
    return;
  }

  // Calculate VAT and the final total
  const vatPercentage = parseFloat(Vat.value) || 0;
  const vatAmount = (totalAmount * vatPercentage) / 100;
  const VatPerPerson = vatAmount / items.reduce((sum, item) => sum + item.people, 0);
  items.forEach(item => {
    item.perPerson += VatPerPerson; // Add VAT per person to each item's per person cost 
  }
  );
  const totalWithVat = totalAmount + vatAmount; // Calculate the total amount including VAT

  // Create and display the results card
  createCard(items, totalAmount, vatAmount, totalWithVat, vatPercentage, VatPerPerson);
});