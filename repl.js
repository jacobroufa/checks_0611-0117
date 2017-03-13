'use strict';

const employees = require('./output/employees.json');
const vendors = require('./output/vendors.json');

const employeeYears = Object.keys(employees);
const vendorYears = Object.keys(vendors);

const employeeList = [];
const vendorList = [];

const employeeData = {};
const vendorData = {};

employeeYears.forEach(year => {
    Object.keys(employees[year]).forEach(month => {
        employees[year][month].forEach(check => {
            let name = check.VendorName;
            let amount = check.TotalCheckAmount;
            let date = check.CheckDate;

            if (employeeList.indexOf(name) <= -1) {
                employeeList.push(name);
                employeeData[name] = {
                    pay: {}
                };
            }

            let pay = employeeData[name].pay;

            if (!pay.numChecks) pay.numChecks = 0;
            if (!pay.totals) pay.totals = {};
            if (!pay.totals[year]) pay.totals[year] = 0;
            if (!pay[year]) pay[year] = [];

            pay.numChecks++;
            pay.totals[year] += amount;
            pay[year].push({ date: date, amount: amount });
        });
    });

    employeeData[year] = {};

    employeeList.forEach(employee => {
        employeeData[year][employee] = {};
    });
});

vendorYears.forEach(year => {
    Object.keys(vendors[year]).forEach(month => {
        vendors[year][month].forEach(check => {
            let id = check.VendorID;
            let name = check.VendorName;
            let amount = check.TotalCheckAmount;
            let date = check.CheckDate;

            if (vendorList.indexOf(id) <= -1) {
                vendorList.push(id);
                vendorData[id] = {
                    name: [],
                    pay: {}
                };
            }

            let dataName = vendorData[id].name;

            if (dataName.indexOf(name) <= -1) {
                dataName.push(name);
            }

            let pay = vendorData[id].pay;

            if (!pay.numChecks) pay.numChecks = 0;
            if (!pay.totals) pay.totals = {};
            if (!pay.totals[year]) pay.totals[year] = 0;
            if (!pay[year]) pay[year] = [];

            pay.numChecks++;
            pay.totals[year] += amount;
            pay[year].push({ date: date, amount: amount });
        });
    });
});

employeeList.sort();
vendorList.sort();
