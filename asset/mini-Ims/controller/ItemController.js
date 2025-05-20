import {itemDB} from "../db/db.js";
import ItemModel from "../model/ItemModel.js"

function loadItem(){
    $('#item-tbody').empty();

    itemDB.forEach((item, index) => {
        const row = `
            <tr>
                 <td>${item.iCode}</td>
                 <td>${item.iName}</td>
                 <td>${item.iQty}</td>
                 <td>${item.iPrice}</td>
            </tr>
        `;
        $('#item-tbody').append(row);
    });
}

$('#item_add').on('click', function () {
    let iCode = $('#iCode').val().trim();
    let iName = $('#iName').val().trim();
    let iQty = $('#iQty').val().trim();
    let iPrice = $('#iPrice').val().trim();


    console.log(`iCode: ${iCode}, iName: ${iName}, iQty: ${iQty}, iPrice: ${iPrice}`);

    // Validate fields
    if (!iCode || !iName || !iQty || !iPrice) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Check for duplicate ID
    if (itemDB.some(customer => customer.iCode === iCode)) {
        Swal.fire({
            title: 'Duplicate!',
            text: 'Item ID already exists.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Create and store item
    let item_data = new ItemModel(iCode, iName, iQty, iPrice);
    itemDB.push(item_data);

    // Store to localStorage
    localStorage.setItem("itemDB", JSON.stringify(itemDB));

    // Refresh UI
    loadItem();

    // Success message
    Swal.fire({
        title: "Success!",
        text: "Item added successfully.",
        icon: "success"
    });

    // Clear form
    $('#iCode, #iName, #iQty, #iPrice').val('');

    // Close modal if applicable
    $('#item_close').click(); // only works if modal has button with id="item_close"
});

$("#item-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let item = itemDB[index];

    $('#iCode').val(item.iCode);
    $('#iName').val(item.iName);
    $('#iQty').val(item.iQty);
    $('#iPrice').val(item.iPrice);
});

let selectedItemIndex = null;



$("#item-tbody").on('click', 'tr', function () {
    selectedItemIndex = $(this).index();
});

$('.btn-outline-warning[data-bs-target="#exampleModal1"]').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'No item selected!',
            text: 'Please click on a item row before updating.',
            icon: 'warning'
        });
        return;
    }

    const item = itemDB[selectedItemIndex];

    $('#iCode1').val(item.iCode);
    $('#iName1').val(item.iName);
    $('#iQty1').val(item.iQty);
    $('#iPrice1').val(item.iPrice);
});


$('.modal-footer .btn.btn-primary').on('click', function () {
    if (selectedItemIndex === null) return;

    let iCode = $('#iCode1').val().trim();
    let iName = $('#iName1').val().trim();
    let iQty = $('#iQty1').val().trim();
    let iPrice = $('#iPrice1').val().trim();

    if (!iCode || !iName || !iQty || !iPrice) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let updatedItem = new ItemModel(iCode, iName, iQty, iPrice);
    itemDB[selectedItemIndex] = updatedItem;

    loadItem();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success"
    });

    $('#exampleModal1').modal('hide');
    selectedItemIndex = null;
});

$('.delete-btn').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'No item selected!',
            text: 'Please select a item to delete.',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            itemDB.splice(selectedItemIndex, 1);
            loadItem();
            selectedItemIndex = null;

            Swal.fire(
                'Deleted!',
                'Item has been deleted.',
                'success'
            );
        }
    });
});


$('form[role="search"]').on('submit', function (e) {
    e.preventDefault();
    const query = $(this).find('input[type="search"]').val().toLowerCase();

    $('#item-tbody').empty();

    itemDB.forEach(item => {
        if (
            item.iCode.toLowerCase().includes(query) ||
            item.iName.toLowerCase().includes(query) ||
            item.iQty.toLowerCase().includes(query) ||
            item.iPrice.toLowerCase().includes(query)
        ) {
            const row = `
                <tr>
                    <td>${item.iCode}</td>
                    <td>${item.iName}</td>
                    <td>${item.iQty}</td>
                    <td>${item.iPrice}</td>
                </tr>
            `;
            $('#item-tbody').append(row);
        }
    });
});

$('#clear').on('click', function () {
    $('#iCode').val('');
    $('#iName').val('');
    $('#iQty').val('');
    $('#iPrice').val('');
});

$('#clear').on('click', function () {
    $('#exampleModal input').val('');
});