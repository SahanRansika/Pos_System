import {customerDB, itemDB, orderDetailsDB} from "../db/db.js";
import OrderDetailsModel from "../model/orderDetailsModel.js";

function loadItem() {
    $('#orderdetails-tbody').empty();

    orderDetailsDB.forEach(item => {
        const row = `
            <tr>
                <td>${item.oId}</td>
                <td>${item.cId}</td>
                <td>${item.cNumber}</td>
                <td>${item.iName}</td>
                <td>${item.iPrice}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
                <td>${item.discount}</td>
                <td>${item.paid}</td>
                <td>${item.balance}</td>
            </tr>
        `;
        $('#orderdetails-tbody').append(row);
    });
}