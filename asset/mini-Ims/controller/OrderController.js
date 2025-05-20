import {customerDB, itemDB, orderDetailsDB} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";
import OrderDetailsModel from "../model/OrderDetailsModel.js";

let savedCustomers = JSON.parse(localStorage.getItem("customerDB")) || [];
savedCustomers.forEach(customer => customerDB.push(customer));
let savedItems = JSON.parse(localStorage.getItem("itemDB")) || [];

savedItems.forEach(item => {
    let reconstructedItem = new ItemModel(
        item.iCode,
        item.iName,
        item.iQty,
        item.iPrice
    );
    itemDB.push(reconstructedItem);
});

let savedOrders = JSON.parse(localStorage.getItem("orderDetailsDB")) || [];
savedOrders.forEach(order => {
    let reconstructedOrder = new OrderDetailsModel(
        order.oId,
        order.cId,
        order.cNumber,
        order.iName,
        order.iPrice,
        order.qty,
        order.total,
        order.discount,
        order.subAmount,
        order.paid,
        order.balance
    );
    orderDetailsDB.push(reconstructedOrder);
});

$('#btnSearchCustomer').on('click', function(event) {
    event.preventDefault();
    let customerId = $('#customerId').val().trim();
    let isNewCustomer = true;

    customerDB.forEach(function (customer) {
        if (customer.cId === customerId) {
            isNewCustomer = false;
            $('#order-tbody').empty();
            $('#custname').val(customer.cName);
            $('#custaddress').val(customer.cAddress);
            $('#custnumber').val(customer.cNumber);
        }
    });

    if (isNewCustomer) {
        Swal.fire({
            title: "Customer not found",
            icon: "warning",
            timer: 1000,
            showConfirmButton: false,
        });
    }
});

$('#btnSearchItem').on('click', function(event) {
    event.preventDefault();
    let itemId = $('#itemId').val().trim();
    let isNewItem = true;

    itemDB.forEach(function (item) {
        if (item.iCode === itemId) {
            isNewItem = false;
            $('#order-tbody').empty();
            $('#itemname').val(item.iName);
            $('#itemsellprice').val(item.iPrice);
            $('#qty').val(item.iQty);
        }
    });

    if (isNewItem) {
        Swal.fire({
            title: "Item not found",
            icon: "warning",
            timer: 1000,
            showConfirmButton: false,
        });
    }
});

$('#orderqty').on('input', function () {
    const qty = parseFloat($('#orderqty').val());
    const price = parseFloat($('#itemsellprice').val());

    if (!isNaN(qty) && !isNaN(price)) {
        const subtotal = qty * price;
        $('#subtotal').val(subtotal.toFixed(2));
        $('#total').val(subtotal.toFixed(2));
    } else {
        $('#subtotal').val('');
    }
});

$('#add_to_card').on('click', function () {
    const itemId = $('#itemId').val().trim();
    const itemName = $('#itemname').val().trim();
    const itemPrice = parseFloat($('#itemsellprice').val()).toFixed(2);
    const qty = $('#qty').val().trim();
    const orderQty = $('#orderqty').val().trim();
    const subtotal = parseFloat($('#subtotal').val()).toFixed(2);

    if (!itemId || !itemName || isNaN(itemPrice) || isNaN(orderQty) || isNaN(subtotal)) {
        Swal.fire({
            title: "Please fill all required fields correctly",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const newRow = `
        <tr>
            <td>${itemId}</td>
            <td>${itemName}</td>
            <td>${itemPrice}</td>
            <td>${qty}</td>
            <td>${orderQty}</td>
            <td>${subtotal}</td>
        </tr>
    `;
    $('#order-tbody').append(newRow);

    $('#itemId').val('');
    $('#itemname').val('');
    $('#itemsellprice').val('');
    $('#qty').val('');
    $('#orderqty').val('');
    $('#subtotal').val('');
});

$('#btn-clear').on('click', function () {
    $('#customerId').val('');
    $('#custname').val('');
    $('#custaddress').val('');
    $('#custnumber').val('');
});

$('#btn-clear').on('click', function () {
    $('#exampleModal input').val('');
});

$('#clear1').on('click', function () {
    $('#itemId').val('');
    $('#itemname').val('');
    $('#itemsellprice').val('');
    $('#qty').val('');
    $('#orderqty').val('');
});

$('#clear1').on('click', function () {
    $('#exampleModal input').val('');
});

$('#discount').on('click', function () {
    const total = parseFloat($('#total').val());
    const discountPercent = parseFloat($('#bouns').val());

    if (isNaN(total) || isNaN(discountPercent)) {
        Swal.fire({
            title: "Please enter valid Total and Discount",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const discountAmount = (total * discountPercent) / 100;

    const discountedTotal = total - discountAmount;

    $('#subAmount').val(discountedTotal.toFixed(2));
});
