document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const locationFilter = document.getElementById("locationFilter");
    const statusFilter = document.getElementById("statusFilter");

    const grid = document.querySelector(".items-grid");

    let allItems = JSON.parse(localStorage.getItem("items")) || [];

    // =========================
    // RENDER ITEMS
    // =========================
    function renderItems(items) {

        if (!grid) return;

        grid.innerHTML = "";

        items.forEach((item, index) => {

            let card = document.createElement("div");
            card.classList.add("item-card");
            card.setAttribute("data-type", item.type);
            card.setAttribute("data-location", item.location);
            card.setAttribute("data-category", item.category || "all");

            card.innerHTML = `
                <span class="tag ${item.type}">${item.type.toUpperCase()}</span>

                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>📍 ${item.location}</p>

                    <button class="details-btn">View Details</button>

                    <button onclick="editItem(${index})"
                        style="margin-top:10px; background:orange; color:white; border:none; padding:5px; cursor:pointer;">
                        Edit
                    </button>

                    <button onclick="deleteItem(${index})"
                        style="margin-top:10px; background:red; color:white; border:none; padding:5px; cursor:pointer;">
                        Delete
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    // initial render
    renderItems(allItems);

    // =========================
    // FILTER FUNCTION
    // =========================
    function filterItems() {

        if (!searchInput || !categoryFilter || !locationFilter || !statusFilter) return;

        let searchValue = searchInput.value.toLowerCase();
        let categoryValue = categoryFilter.value;
        let locationValue = locationFilter.value;
        let statusValue = statusFilter.value;

        let filtered = allItems.filter(item => {

            let matchSearch = item.name.toLowerCase().includes(searchValue);
            let matchCategory = (categoryValue === "all" || item.category === categoryValue);
            let matchLocation = (locationValue === "all" || item.location === locationValue);
            let matchStatus = (statusValue === "all" || item.type === statusValue);

            return matchSearch && matchCategory && matchLocation && matchStatus;
        });

        renderItems(filtered);
    }

    if (searchInput) searchInput.addEventListener("keyup", filterItems);
    if (categoryFilter) categoryFilter.addEventListener("change", filterItems);
    if (locationFilter) locationFilter.addEventListener("change", filterItems);
    if (statusFilter) statusFilter.addEventListener("change", filterItems);

});

// =========================
// ADD ITEM
// =========================
function addItem(event) {

    event.preventDefault();

    let name = document.getElementById("itemName");
    let location = document.getElementById("itemLocation");
    let type = document.getElementById("itemType");

    if (!name || !location || !type) {
        alert("Form not found!");
        return;
    }

    if (name.value.trim() === "" || location.value.trim() === "") {
        alert("Please fill all fields");
        return;
    }

    let items = JSON.parse(localStorage.getItem("items")) || [];

    items.push({
        name: name.value,
        location: location.value,
        type: type.value,
        category: "all"
    });

    localStorage.setItem("items", JSON.stringify(items));

    alert("Item Reported Successfully!");

    name.value = "";
    location.value = "";

    location.reload();
}

// =========================
// DELETE ITEM
// =========================
function deleteItem(index) {

    let items = JSON.parse(localStorage.getItem("items")) || [];

    items.splice(index, 1);

    localStorage.setItem("items", JSON.stringify(items));

    alert("Item Deleted Successfully!");

    location.reload();
}

// =========================
// EDIT ITEM
// =========================
function editItem(index) {

    let items = JSON.parse(localStorage.getItem("items")) || [];

    let item = items[index];

    let newName = prompt("Edit Item Name:", item.name);
    let newLocation = prompt("Edit Location:", item.location);
    let newType = prompt("Edit Type (lost/found):", item.type);

    if (newName && newLocation && newType) {

        items[index] = {
            name: newName,
            location: newLocation,
            type: newType,
            category: "all"
        };

        localStorage.setItem("items", JSON.stringify(items));

        alert("Item Updated Successfully!");

        location.reload();
    }
}