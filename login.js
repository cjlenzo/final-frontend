updateBasketCount();

function updateBasketCount() {
    let basketItems = JSON.parse(localStorage.getItem("basket")) || [];
    let basketLink = document.getElementById("basket-link");
    basketLink.textContent = `Basket (${basketItems.length})`;
}