import {customerDB, itemDB, orderDetailsDB} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";
import OrderDetailsModel from "../model/OrderDetailsModel.js";

let savedCustomers = JSON.parse(localStorage.getItem("customerDB")) || [];
savedCustomers.forEach(customer => customerDB.push(customer));
let savedItems = JSON.parse(localStorage.getItem("itemDB")) || [];

var cart = [];
var total = 0;
$("#discount").val(0);


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

$('#btnAddToCart').on('click', function (event){
    event.preventDefault();

    if ($('#itemName').val() === "") {
        Swal.fire({
            title: "Please select a item",
            icon: "error",
            timer: 1000
        });
        return;
    }
    if ($('#orderQty').val() === "") {
        Swal.fire({
            title: "Please fill the order quantity",
            icon: "error",
            timer: 1000
        });
        return;
    }

    let itemId = $('#itemId').val();
    let itemName = $('#itemname').val();
    let price = $('#itemsellprice').val();
    let orderQty = $('#orderQty').val();
    let totalPrice = Number(price) * Number(orderQty);

    let isValidItem = true;
    itemDB.forEach(function (item){
        if (item.iId === itemId){
            if (orderQty > item.qty ){
                Swal.fire({
                    title: "Not enough stock",
                    icon: "error",
                    timer: 1000
                });
                isValidItem = false;
            }else {
                item.qty = Number(item.qty) - Number(orderQty);
            }
        }
    });

    if (!isValidItem){
        return;
    }

    let item = {itemId, itemName, price, orderQty, totalPrice};
    let isNewItem = true;
    cart.forEach(function (cart){
        if (cart.itemId === itemId){
            cart.orderQty = Number(orderQty) + Number(cart.orderQty);
            isNewItem = false;
        }
    });
    if (isNewItem){
        cart.push(item);
    }

    $('#table-body').empty();
    total = 0;
    cart.forEach(function (cart){
        let itemData = `<tr class="row">
                            <td class="col">${cart.itemId}</td>
                            <td class="col">${cart.itemName}</td>
                            <td class="col">${cart.orderQty}</td>
                            <td class="col">${cart.price}</td>
                            <td class="col">${cart.totalPrice}</td>
                            <td class="col"><button type="button" class="btn btn-danger" id="clear">Delete</button></td>
                        </tr>`

        $('#table-body').append(itemData);

        total = Number(total) + ((Number(cart.price) * Number(cart.orderQty)));
    });
    $('#lblTotal').text(`TOTAL : ${total} /=`);
    console.log(total)
});
$('#clear').on('click', function () {
    $('#itemId').val('');
    $('#itemName').val('');
    $('#orderQty').val('');
    $('#price').val('');
    $('#totalPrice').val('');
});


$('#btn-place-order').on('click', function (event){
    event.preventDefault();

    if ($('#custname').val() === "") {
        Swal.fire({
            title: "Please select a customer",
            icon: "error",
            timer: 1000
        });
        return;
    }
    if (cart.length === 0){
        Swal.fire({
            title: "Please add items to cart",
            icon: "error",
            timer: 1000
        });
        return;
    }
    if ($('#cash').val() === 0 || $('#cash').val() === "") {
        Swal.fire({
            title: "Please enter cash",
            icon: "error",
            timer: 1000
        });
        return;
    }
    let customerId = $('#customerId').val();
    let customerName = $('#custname');
    let phoneNumber = $('#custnumber').val();
    let orderDate = new Date().toLocaleDateString();
    let orderId = $('#orderId').val();
    let cash = $('#cash').val();
    let balance = $('#balance').val();
    let discount = $('#discount').val();
    let items = [];
    cart.forEach(function (cart){
        let item = {
            itemId: cart.itemId,
            itemName: cart.itemName,
            qty: cart.orderQty,
            price: cart.price,
            totalPrice : Number(cart.price) * Number(cart.orderQty)
        }
        items.push(item);
    });

    let order = new OrderDetailsModel(orderId, orderDate, customerId, customerName, phoneNumber, total,cash, balance, discount, items);
    orderDetailsDB.push(order);
    Swal.fire({
        title: "Done",
        icon: "success",
        timer: 1000
    });
    console.log(orderDetailsDB);
});

$("#cash").on('keyup', function (event){
    let discount = $("#discount").val();
    let cash  = $("#cash").val();
    let discountPrice = discount * total / 100;


    console.log(total);
    if (total <= Number(cash)) {
        $("#balance").val(Number(cash) - (total - discountPrice));
    }


});