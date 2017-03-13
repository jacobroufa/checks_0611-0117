'use strict';

const employees = require('./output/employees.json').reduce(byYears, {});
const vendors = require('./output/vendors.json').reduce(byYears, {});

const employeeYears = Object.keys(employees);
const vendorYears = Object.keys(vendors);

const employeeList = [];
const vendorList = [];

const employeeData = {};
const vendorData = {};

employeeYears.forEach(year => {
    Object.keys(employees[year]).forEach(month => {
        employees[year][month].forEach(createDataObject(employeeList, employeeData, year));
    });
});

vendorYears.forEach(year => {
    Object.keys(vendors[year]).forEach(month => {
        vendors[year][month].forEach(createDataObject(vendorList, vendorData, year));
    });
});

employeeList.sort();
vendorList.sort();

function byYears (initial, next) {
    let date = next.CheckDate.split('/');
    let months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    };
    let month = months[date[0]];
    let year = date[2];

    if (!initial[year]) {
        initial[year] = {};
    }
    if (!initial[year][month]) {
        initial[year][month] = [];
    }

    initial[year][month].push(next);

    return initial;
}

function createDataObject (list, data, year) {
    return function (check) {
        let id = check.VendorID;
        let name = check.VendorName;
        let amount = parseFloat(check.TotalCheckAmount);
        let date = check.CheckDate;
        let key = id ? id : name;

        if (list.indexOf(key) <= -1) {
            list.push(key);
            data[key] = {
                pay: {}
            };

            if (id) {
                data[key].name = [];

                let dataName = data[key].name;

                if (dataName.indexOf(name) <= -1) {
                    dataName.push(name);
                }
            }
        }

        let pay = data[key].pay;

        if (!pay.numChecks) pay.numChecks = 0;
        if (!pay.totals) pay.totals = {};
        if (!pay.totals[year]) pay.totals[year] = 0;
        if (!pay[year]) pay[year] = [];

        pay.numChecks++;
        pay.totals[year] += amount;
        pay[year].push({ date: date, amount: amount });
    };
}
