let host = getHost();

if (!configuration.isLoggedIn()) {
    window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", displayOrders());

async function fetchOrdersForCustomer(username) {
    let request = {
        method: "GET",
    }

    try {
        let response = await fetch(`${host}/orders/${username}`, request);
        if (response.status === 200) {
            return await response.json();
        } else {
            console.log(`Failed to fetch orders. Status: ${response.status}`);
            alert("Failed to fetch orders. Please try again later.");
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while fetching orders.");
    }
}

// Display orders in the table
async function displayOrders() {
    let username = localStorage.getItem("username");
    if (!username) {
        console.error("Username not found in local storage.");
        return;
    }

    let orders = await fetchOrdersForCustomer(username);
    let flowers = await getAllFlowers();

    let orderTableBody = document.getElementById("orderResult");

    orderTableBody.innerHTML = "";

    for (let order of orders) {
        for (let flower of flowers) {
            if (order.flowerId === flower.id) {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${flower.name}</td>
                    <td>$${order.totalCost}</td>
                    <td>${order.recipientName}</td>
                    <td>${order.status}</td>
                `;
                orderTableBody.appendChild(row);
                break;
            }
        }
    }
}

async function getAllFlowers() {
    let request = {
        method: "GET",
    };
    let response = await fetch(host + "/flowers", request);
    let result = await response.json();
    return result;
}