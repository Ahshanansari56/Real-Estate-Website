// Step 1: Get the ul element
let foodList = document.getElementById("foodList");

// Step 2: Create list items
let food1 = document.createElement("li");
food1.textContent = "Pizza";

let food2 = document.createElement("li");
food2.textContent = "Burger";

let food3 = document.createElement("li");
food3.textContent = "Pasta";

// Step 3: Add items to the list
foodList.appendChild(food1);
foodList.appendChild(food2);
foodList.appendChild(food3);

// Step 4: Edit the 1st food item
foodList.children[0].textContent = "Biryani";

// Step 5: Remove the last food item
foodList.removeChild(foodList.lastElementChild);
