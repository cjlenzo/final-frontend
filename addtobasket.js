let host = getHost();
let queryParams = new URLSearchParams(window.location.search);
let flowerId = queryParams.get("id");
let flowerName = queryParams.get("name");
let flowerType = queryParams.get("type");
let flowerOccasion = queryParams.get("occasion");
let flowerColor = queryParams.get("color");
let flowerCost = queryParams.get("cost");

let options = document.getElementById("options");
div = document.createElement("div");
div.className = "container3"
div.innerHTML = `
    <h1 style = "text-align: center">${flowerName}</h1>
    <h3>Delivery Date</h3>
    <input type = "date" id = "delivery-date" style = "width: 100%">
    <h3>Purchasing Options</h3>
    <form>
        <div class = "purchase-option">
            <input type = "radio" id = "one-time">
            <label for = "one-time"> One time purchase: <b>$${flowerCost}</b></label></br>
        </div></br>
        </br>
        <button type = "submit"> Add to Basket </button>
    </form>

`;
options.appendChild(div);

document.querySelector("form").addEventListener("submit", addToBasket)

window.onload = function() {
    updateBasketCount();
};

displayFlowerImage();

async function displayFlowerImage() {
    let request = {
        method: "GET",
        redirect: "follow"
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

function addToBasket(event) {
    event.preventDefault();

    let dDate = document.getElementById("delivery-date").value;

    let delDate = formatDate(dDate);

    let sOption = document.querySelector("input[type=radio]:checked").id;

    let basketItems = [];

    basketItems.push({ id: flowerId, name: flowerName, type: flowerType, occasion: flowerOccasion, color: flowerColor, cost: flowerCost, deliveryDate: delDate, selectedOption: sOption});

    localStorage.setItem("basket", JSON.stringify(basketItems));

    alert("Item added to basket!");

    window.location.href = "adddeliveryinfo.html";
}

function formatDate(inputDate) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateParts = inputDate.split('-');
    let year = dateParts[0];
    let month = months[parseInt(dateParts[1]) - 1];
    let day = dateParts[2];

    return `${month} ${day}, ${year}`;
}

function updateBasketCount() {
    let basketItems = JSON.parse(localStorage.getItem("basket")) || [];
    let basketLink = document.getElementById("basket-link");
    basketLink.textContent = `Basket (${basketItems.length})`;
}