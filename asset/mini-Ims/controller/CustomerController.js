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
                 <td>${item.cNumber}</td>
            </tr>
        `;
        $('#customer-tbody').append(row);
    });
}

$('#customer_add').on('click', function () {
    let cId = $('#cId').val().trim();
    let cName = $('#cName').val().trim();
    let cAddress = $('#cAddress').val().trim();
    let cNumber = $('#cNumber').val().trim();

    if (!cId || !cName || !cAddress || !cNumber) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let customer_data = new CustomerModel(cId, cName, cAddress, cNumber);
    customerDB.push(customer_data);

    localStorage.setItem("customerDB", JSON.stringify(customerDB));

    loadCustomer();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });

    $('#cId').val('');
    $('#cName').val('');
    $('#cAddress').val('');
    $('#cNumber').val('');
    $('#customer_close').click();
});

$("#customer-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let customer = customerDB[index];

    $('#cId').val(customer.cId);
    $('#cName').val(customer.cName);
    $('#cAddress').val(customer.cAddress);
    $('#cNumber').val(customer.cNumber);
});

let selectedCustomerIndex = null;



$("#customer-tbody").on('click', 'tr', function () {
    selectedCustomerIndex = $(this).index();
});

$('.btn-outline-warning[data-bs-target="#exampleModal1"]').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'No customer selected!',
            text: 'Please click on a customer row before updating.',
            icon: 'warning'
        });
        return;
    }

    const customer = customerDB[selectedCustomerIndex];

    $('#cId1').val(customer.cId);
    $('#cName1').val(customer.cName);
    $('#cAddress1').val(customer.cAddress);
    $('#cNumber1').val(customer.cNumber);
});

$('.modal-footer .btn.btn-primary').on('click', function () {
    if (selectedCustomerIndex === null) return;

    let cId = $('#cId1').val().trim();
    let cName = $('#cName1').val().trim();
    let cAddress = $('#cAddress1').val().trim();
    let cNumber = $('#cNumber1').val().trim();

    if (!cId || !cName || !cAddress || !cNumber) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let updatedCustomer = new CustomerModel(cId, cName, cAddress, cNumber);
    customerDB[selectedCustomerIndex] = updatedCustomer;

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

    customerDB.forEach(item => {
        if (
            item.cId.toLowerCase().includes(query) ||
            item.cName.toLowerCase().includes(query) ||
            item.cAddress.toLowerCase().includes(query) ||
            item.cNumber.toLowerCase().includes(query)
        ) {
            const row = `
                <tr>
                    <td>${item.cId}</td>
                    <td>${item.cName}</td>
                    <td>${item.cAddress}</td>
                    <td>${item.cNumber}</td>
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
    $('#cNumber').val('');
});

$('#clear').on('click', function () {
    $('#exampleModal input').val('');
});