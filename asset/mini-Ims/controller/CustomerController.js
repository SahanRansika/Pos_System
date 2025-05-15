import {customerDB} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js"

function loadCustomer(){
    $('#customer-tbody').empty();

    customerDB.forEach((item, index) => {
        const row = `
            <tr>
                 <td>${item.cId}</td>
                 <td>${item.cName}</td>
                 <td>${item.cAddress}</td>
                 <td>${item.cSalary}</td>
            </tr>
        `;
        $('#customer-tbody').append(row);
    });
}

$('#customer_add').on('click', function () {
    let cId = $('#cId').val().trim();
    let cName = $('#cName').val().trim();
    let cAddress = $('#cAddress').val().trim();
    let cSalary = $('#cSalary').val().trim();

    console.log(`cId: ${cId}, cName: ${cName}, cAddress: ${cAddress}, cSalary: ${cSalary}`);

    // Validate fields
    if (!cId || !cName || !cAddress || !cSalary) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Check for duplicate ID
    if (customerDB.some(customer => customer.cId === cId)) {
        Swal.fire({
            title: 'Duplicate!',
            text: 'Customer ID already exists.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Create and store customer
    let customer_data = new CustomerModel(cId, cName, cAddress, cSalary);
    customerDB.push(customer_data);

    // Store to localStorage
    localStorage.setItem("customerDB", JSON.stringify(customerDB));

    // Refresh UI
    loadCustomer();

    // Success message
    Swal.fire({
        title: "Success!",
        text: "Customer added successfully.",
        icon: "success"
    });

    // Clear form
    $('#cId, #cName, #cAddress, #cSalary').val('');

    // Close modal if applicable
    $('#customer_close').click(); // only works if modal has button with id="customer_close"
});


$("#customer-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let customer = customerDB[index];

    $('#cId').val(customer.cId);
    $('#cName').val(customer.cName);
    $('#cAddress').val(customer.cAddress);
    $('#cSalary').val(customer.cSalary);
});

let selectedCustomerIndex = null;



$("#customer-tbody").on('click', 'tr', function () {
    selectedCustomerIndex = $(this).index();
});

$('.btn-warning[data-bs-target="#exampleModal1"]').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'No customer selected!',
            text: 'Please click on a customer row before updating.',
            icon: 'warning'
        });
        return;
    }

    const customer = customers_db[selectedCustomerIndex];

    $('#cId1').val(customer.cId);
    $('#cName1').val(customer.cName);
    $('#cAddress1').val(customer.cAddress);
    $('#cSalary1').val(customer.cSalary);
});

$('.modal-footer .btn.btn-primary').on('click', function () {
    if (selectedCustomerIndex === null) return;

    let cId = $('#cId1').val().trim();
    let cName = $('#cName1').val().trim();
    let cAddress = $('#cAddress1').val().trim();
    let cSalary = $('#cSalary1').val().trim();

    if (!cId || !cName || !cAddress || !cSalary) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let updatedCustomer = new CustomerModel(cId, cName, cAddress, cSalary);
    customers_db[selectedCustomerIndex] = updatedCustomer;

    loadCustomer();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success"
    });

    $('#exampleModal1').modal('hide');
    selectedCustomerIndex = null;
});


$('.delete-btn').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'No customer selected!',
            text: 'Please select a customer to delete.',
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
            customerDB.splice(selectedCustomerIndex, 1);
            loadCustomer();
            selectedCustomerIndex = null;

            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            );
        }
    });
});


$('form[role="search"]').on('submit', function (e) {
    e.preventDefault();
    const query = $(this).find('input[type="search"]').val().toLowerCase();

    $('#customer-tbody').empty();

    customers_db.forEach(item => {
        if (
            item.cId.toLowerCase().includes(query) ||
            item.cName.toLowerCase().includes(query) ||
            item.cAddress.toLowerCase().includes(query) ||
            item.cSalary.toLowerCase().includes(query)
        ) {
            const row = `
                <tr>
                    <td>${item.cId}</td>
                    <td>${item.cName}</td>
                    <td>${item.cAddress}</td>
                    <td>${item.cSalary}</td>
                </tr>
            `;
            $('#customer-tbody').append(row);
        }
    });
});

$('#clear').on('click', function () {
    $('#cId').val('');
    $('#cName').val('');
    $('#cAddress').val('');
    $('#cSalary').val('');
});

$('#clear').on('click', function () {
    $('#exampleModal input').val('');
});