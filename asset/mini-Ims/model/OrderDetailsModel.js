export default class OrderDetailsModel {
    constructor(oId,orderDate, cId, customerName,total,cash, balance, discount) {
        this.oId = oId;
        this.orderDate = orderDate;
        this.cId = cId;
        this.customerName = customerName;
        this.total = total;
        this.cash = cash;
        this.balance = balance;
        this.discount = discount;
    }
}