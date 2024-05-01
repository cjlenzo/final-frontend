let host = getHost();
let theBasket = JSON.parse(localStorage.getItem("basket"));
let theItem = theBasket[0];
let flowerId = theItem.id;
let flowerName = theItem.name;
let flowerType = theItem.type;
let flowerOccasion = theItem.occasion;
let flowerColor = theItem.color;
let flowerCost = theItem.cost;
let deliveryDate = theItem.deliveryDate;
let selectedOption = theItem.selectedOption;

document.getElementById("flower-name").textContent = flowerName;
document.getElementById("flower-price").textContent = `$${flowerCost}`;

p = document.createElement("p");
p.innerHTML = `${deliveryDate}`
document.getElementById("pic").appendChild(p);

let loginSignupContainer = document.getElementById("logging");

if (configuration.isLoggedIn()) {
    loginSignupContainer.style.display = "none";
} else {
    loginSignupContainer.style.display = "block";
}

displayFlowerImage();

document.querySelector('.cButton').addEventListener("click", function(event) {
    event.preventDefault();

    let deliveryInfo = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        relationship: document.getElementById("relationship").value,
        address: document.getElementById("address").value,
        apartment: document.getElementById("apartment#").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zipCode: document.getElementById("zipCode").value
    };

    let queryString = new URLSearchParams(deliveryInfo).toString();
    let nextPageURL = `placeorder.html?${queryString}`;
    
    window.location.href = nextPageURL;
});



async function displayFlowerImage() {
    let request = {
        method: "GET"
    };

    let response = await fetch(`${host}/flowers/${flowerId}/image`, request);

    if (response.status == 302) {
        let imageData = await response.blob();
        let url = URL.createObjectURL(imageData);
        document.getElementById("flower-image").src = url;
    }
    else {
        alert("An Error occurred retreiving the flower image.")
        console.log(response.json);
    }

}