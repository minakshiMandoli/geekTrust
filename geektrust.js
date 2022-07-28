const fs = require("fs");
const moment = require('moment')
const plans = require('./models/planModel')
const topUp = require('./models/topUpModel')



let subscriptionPlan= {};
let planList = [];
let totalPrice= 0;
let topupList = [];
function main(dataInput) {
    var inputData = dataInput.toString().split("\n")
    for (i = 0; i < inputData.length; i++) {
        if (inputData) {
            let input = inputData[i].split(' ')
            switch (input[0]) {
                case 'START_SUBSCRIPTION':
                    addDate(input[1].trim());
                    break;
                case 'ADD_SUBSCRIPTION':
                    subScribePlan(input[1],input[2]);
                    break;
                case 'ADD_TOPUP':
                    addTopUp(input[1],input[2]);
                        break;
                case 'PRINT_RENEWAL_DETAILS':
                    getData()
                        break;
                
            }
        }
    }
}
const getData =function(){
    if(planList.length === 0){
        console.log('SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    for(j=0;j<planList.length;j++){
        console.log('RENEWAL_REMINDER '+planList[j].type+' '+planList[j].enDate);
    }
    console.log('RENEWAL_AMOUNT '+ totalPrice);
}

data = fs.readFileSync(process.argv[2]).toString();
const addTopUp =(device,num)=>{
    if(subscriptionPlan.date == 'NULL'){
        console.log('ADD_TOPUP_FAILED INVALID_DATE');
        return;
    }
    if(planList.length === 0){
        console.log('ADD_TOPUP_FAILED SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    let checkSub = topupList.find(item=>item==device+'_'+num)
    if(checkSub){
        console.log('ADD_TOPUP_FAILED DUPLICATE_TOPUP');
        return;
    }
    let topInfo = topUp[device];
    let topPrice = topInfo.amount * num;
    totalPrice = totalPrice + topPrice;
    topupList.push(device+'_'+num);  
}
const subScribePlan= function(type,plan){
    let planDetails =  plans[type];
    let month = planDetails[plan.trim()].time
    if(subscriptionPlan.date == 'NULL'){
        console.log('ADD_SUBSCRIPTION_FAILED INVALID_DATE');
        return;
    }
    
    let endDate = moment(subscriptionPlan.date, "DD-MM-YYYY").add(month, 'M').format('DD-MM-YYYY');
    let obj = {
        type,
        plan,
        startDate:subscriptionPlan.date,
        enDate: moment(endDate, "DD-MM-YYYY").subtract(10, 'days').format('DD-MM-YYYY')
    }
    let checkSubscription = planList.find(item=>item.type.trim()==type.trim())
    if(checkSubscription){
        console.log('ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY');
        return;
    } 
    if(!checkSubscription){
        planList.push(obj);
        totalPrice = totalPrice + planDetails[plan.trim()].amount
    }
}
const addDate = function(dateStr){
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (dateStr.match(regex) === null) {
        console.log('INVALID_DATE');
        subscriptionPlan.date='NULL';
        return "NULL";
    }
    let [day, month, year] = dateStr.split('-');
    let isoFormattedStr = `${year}-${month}-${day}`;
    let date = new Date(isoFormattedStr);
    let timeStamp = date.getTime();
    if (typeof timeStamp !== 'number' || Number.isNaN(timeStamp)) {
        console.log('INVALID_DATE');
        subscriptionPlan.date ='NULL';
        return "NULL";
    }
    subscriptionPlan.date = dateStr; 
}
main(data);


module.exports = { main }