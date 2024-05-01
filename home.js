let host = getHost();
let flowers = []
let list = document.getElementById("list");

window.onload = async function() {

    if (flowers.length == 0) {
        flowers = await getAllFlowers();
    }

    let typeValues = getUniqueValues(flowers, "type");
    let occasionValues = getUniqueValues(flowers, "occasion");
    let colorValues = getUniqueValues(flowers, "color");

    let typeFilter = generateFilterDropdown(typeValues, "type");
    typeFilter.id = "type-filter";
    document.querySelector(".filter-container").appendChild(typeFilter);

    const occasionFilter = generateFilterDropdown(occasionValues, "occasion");
    occasionFilter.id = "occasion-filter";
    document.querySelector(".filter-container").appendChild(occasionFilter);

    const colorFilter = generateFilterDropdown(colorValues, "color");
    colorFilter.id = "color-filter";
    document.querySelector(".filter-container").appendChild(colorFilter);

    updateBasketCount();

    applyFilters();
}

document.getElementById("sort-direction").addEventListener("change", () => {
    applyFilters();
})

async function getAllFlowers() {
    let request = {
        method: "GET",
    };
    let response = await fetch(host + "/flowers", request);
    let result = await response.json();
    return result;
}

async function displayAllFlowers(filteredFlowers) {
    list.innerHTML = "";
    for (let flower of filteredFlowers) {
        let div = document.createElement("div");
        div.id = `${flower.id}`;
        div.className = "card";

        let innerHtml = `
        <img src="${await getTheImage(flower.id)}" alt="${flower.name}" style="width:100%">
        <div class="container">
            <h4><b>${flower.name}</b></h4> 
            <p>From <b>$${flower.cost}</b></p>
        </div>
        `;
        div.innerHTML = innerHtml;
        div.addEventListener("click", async() => {
            let queryParams = new URLSearchParams({
                id: flower.id,
                name: flower.name,
                type: flower.type,
                occasion: flower.occasion,
                color: flower.color,
                cost: flower.cost,
            });
            let url = `addtobasket.html?${queryParams.toString()}`;
            window.location.href = url;
        })
        list.appendChild(div);
    }

}

async function getTheImage(flowerId) {
    const request = {
        method: "GET",
    };
    let response = await fetch(`${host}/flowers/${flowerId}/image`, request);
    if (response.status == 401) {
        alert(response.status);
        logout();
        return "";
    }
    let imageData = await response.blob();
    return URL.createObjectURL(imageData);
}

function getUniqueValues(flowerArray, property) {
    let propArray = [];
    for (let flower of flowerArray) {
        propArray.push(flower[property]);
    }
    return propArray;
}

function generateFilterDropdown(values, property) {
    let uniqueValues = new Set(values);

    let dropdown = document.createElement("select");
    dropdown.innerHTML = (`<option value="">${property}</option>`);

    for (let value of uniqueValues) {
        dropdown.innerHTML += `<option value="${value}">${value}</option>`;
    }

    dropdown.addEventListener("change", () => {
        applyFilters();
    });
    return dropdown;
}

function applyFilters() {
    let tFilter = document.getElementById("type-filter").value;
    let oFilter = document.getElementById("occasion-filter").value;
    let cFilter = document.getElementById("color-filter").value;

    let filteredFlowers = [];

    if (tFilter == "" && oFilter == "" && cFilter == "") {
        filteredFlowers = flowers.slice();
    }
    else {
        for (let flower of flowers) {
            if ((!tFilter || flower.type == tFilter) && (!oFilter || flower.occasion == oFilter) && (!cFilter || flower.color == cFilter)) {
                filteredFlowers.push(flower);
            }
        }
    }

    let sortDirection = document.getElementById("sort-direction").value;
    
    if (sortDirection != "") {
        filteredFlowers.sort((a, b) => sortDirection == "asc" ? a.cost - b.cost : b.cost - a.cost);
    }

    console.log(filteredFlowers);

    displayAllFlowers(filteredFlowers);
}

function updateBasketCount() {
    let basketItems = JSON.parse(localStorage.getItem("basket")) || [];
    let basketLink = document.getElementById("basket-link");
    basketLink.textContent = `Basket (${basketItems.length})`;
}