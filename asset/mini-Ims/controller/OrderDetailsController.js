import {orderDetailsDB} from "../db/db.js";

var orderArray = orderDetailsDB;

loadTable();

function loadTable(){
    console.log(orderArray);
    $("#customer-table-body").empty();

    orderArray.forEach((order, index) => {
        let customerRow = `<tr>
                        <td>${index}</td>
                        <td>${order.oId}</td>
                        <td>${order.orderDate}</td>
                        <td>${order.cId}</td>
                        <td>${order.customerName}</td>
                        <td>${order.total}</td>
                        <td>${order.cash}</td>
                        <td>${order.balance}</td>
                        <td>${order.discount}</td>
                        <td>
                            <button type="button" class="btn btn-primary" id="itemBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            Item
                            </button>
                        </td>
                        <td><button type="button" class="btn btn-danger" id="deleteBtn">Delete</button></td>
                    </tr>`
        $("#customer-table-body").append(customerRow);
    });
}


$("#customer-table-body").on('click', '#deleteBtn', function (event){
    let rowIndex = $(this).closest('tr').index();
    orderDetailsDB.splice(rowIndex, 1);
    loadTable();
});

$("#customerSearchBtn").on('click', function (event){
    event.preventDefault();

    orderArray = [];
    let customerId = $("#txtCustomerId").val();

    orderDetailsDB.forEach(order => {
        if (order.cId===customerId){
            orderArray.push(order);
        }
    });
    loadTable();
});

$("#clearBtn").on('click', function (event){
    event.preventDefault();

    $("txtCustomerId").val("asdf");
    console.log("click");
    loadTable();
});