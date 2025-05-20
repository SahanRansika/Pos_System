export default class OrderDetailsModel {
    constructor(oId, cId, cNumber, iName, iPrice, qty, total, discount, subAmount, paid, balance) {
        this.oId = oId;
        this.cId = cId;
        this.cNumber = cNumber;
        this.iName = iName;
        this.iPrice = iPrice;
        this.qty = qty;
        this.total = total;
        this.discount = discount;
        this.subAmount = subAmount;
        this.paid = paid;
        this.balance = balance;
    }
}