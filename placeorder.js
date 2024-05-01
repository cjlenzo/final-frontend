let host = getHost();

let queryParams = new URLSearchParams(window.location.search);
let firstName = queryParams.get("firstName");
let lastName = queryParams.get("lastName");
let relationship = queryParams.get("relationship");
let address = queryParams.get("address");
let apartment = queryParams.get("apartment#");
let city = queryParams.get("city");
let state = queryParams.get("state");
let zipCode = queryParams.get("zipCode");

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

let discount = 0;

document.getElementById("flower-name").textContent = flowerName;
document.getElementById("dDate").textContent = deliveryDate;
document.getElementById("price").textContent = `$${flowerCost}`;
document.getElementById("address").innerHTML = `
    <p>${firstName} ${lastName}</p>
    <p>${address}</p>
    <p>${city}, ${state} ${zipCode}</p>
`;

document.getElementById("subtotal").innerHTML = `
    <p>$${flowerCost}</p>
`;
document.getElementById("delivery").innerHTML = `
    <p>$25</p>
`;
let discountContainer = document.getElementById("discountAmount");
let discCont = document.getElementById("discountDisplay");
if (configuration.isLoggedIn()) {
    discount = 10;
    discCont.innerHTML = `<p>You are saving $${discount} on this order</p>`
    discountContainer.innerHTML = `<p>$${discount}</p>`;
}
else {
    discCont.innerHTML = `<p>You are saving $${discount} on this order. Signup or Login to Save!!</p>`
    discountContainer.innerHTML = `<p>$${discount}</p>`
}
document.getElementById("tax").innerHTML = `
    <p>$0</p>
`;
document.getElementById("total").innerHTML = `
    <p>$${calculateOrderTotal()}</p>
`;

displayFlowerImage();

document.querySelector(".cButton").addEventListener("click", function(event) {
    event.preventDefault();

    let orderData = {
        flowerId: flowerId,
        customerUserName: getUsername(), // Assuming you have a function to get the username
        totalCost: calculateOrderTotal(),
        recipientName: `${firstName} ${lastName}`,
        recipientAddress: address,
        recipientCity: city,
        recipientState: state,
        recipientZip: zipCode,
        deliveryDate: deliveryDate,
        status: "Submitted"
    };

    alert(getUsername());
    console.log(orderData);
    sendOrderData(orderData);
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

function calculateOrderTotal() {
    let subtotal = parseFloat(flowerCost);
    let deliveryCost = 25;
    let discount = configuration.isLoggedIn() ? 10 : 0;
    let tax = 0;

    let amount = subtotal + deliveryCost - discount + tax;
    return amount
}

async function sendOrderData(orderData) {
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    };

    try {
        console.log("Request Headers: ", request.headers);
        let response = await fetch(`${host}/orders`, request);
        if (response.status === 200) {
            alert("Order placed successfully!");
            localStorage.getItem("basket");
            window.location.href = "home.html";
        } else {
            console.log(`Failed to place order. Status: ${response.status}`);
            alert("Failed to place order. Please try again later.");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order.");
    }
}

function getUsername() {
    return localStorage.getItem("username");
}