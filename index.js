'use strict';

const fs = require('fs');
const path = require('path');
const PDF = require('pdf2json');

const parser = new PDF();

const thisPath = process.cwd();
const checksPdfPath = path.join(thisPath, 'checks.pdf');
const outputDir = path.join(thisPath, 'output');
const employeesJsonPath = path.join(outputDir, 'employees.json');
const vendorsJsonPath = path.join(outputDir, 'vendors.json');

try {
    console.log('ensuring our data directory exists');
    fs.statSync(outputDir);
} catch (err) {
    console.log('creating our data directory');
    fs.mkdirSync(outputDir);
}

function cleanText (text) {
    return decodeURIComponent(text.replace(/\+/g, ' ')).trim();
}

function getChecks (page, cols) {
    let initialRow = true;
    let place = 0;
    let labels = [];
    let rows = [];
    let row = {};

    page.forEach(mark => {
        if (place >= cols) {
            if (initialRow) {
                initialRow = false;
            } else {
                rows.push(row);
                row = {};
            }

            place = 0;
        }

        mark.R.forEach(cell => {
            let cellText = cleanText(cell.T) || '';

            if (initialRow) {
                labels.push(cellText);
            } else {
                // If the VendorID is not in the expected format, we are looking at an employee.
                // Per FOIA response (linked below), employee ID numbers have been redacted.
                // http://www.boarddocs.com/il/rps205/Board.nsf/files/AJENPU5FE10B/$file/PDF%201.pdf
                if (place === 3 && !cellText.match(/^(DNE|V)\d+$/i)) {
                    row[labels[place]] = '';
                    place++;
                }

                row[labels[place]] = cellText;
            }
        });

        place++;
    });

    return rows;
}

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

parser.on('pdfParser_dataError', error => console.error(error.parserError));

parser.on('pdfParser_dataReady', data => {
    const pages = data.formImage.Pages;
    const numPages = pages.length;
    let checks = [];

    console.log(numPages + ' pages of data to parse');

    pages.forEach((page, i) => {
        console.log('parsing page ' + i);
        checks = checks.concat(getChecks(page.Texts, 5));
    });

    console.log('filtering employees');
    let employees = checks.filter(check => !check.VendorID)
        .reduce(byYears, {});
    console.log('filtering vendors');
    let vendors = checks.filter(check => check.VendorID)
        .reduce(byYears, {});

    console.log('writing our parsed JSON');
    fs.writeFile(employeesJsonPath, JSON.stringify(employees, null, 4));
    fs.writeFile(vendorsJsonPath, JSON.stringify(vendors, null, 4));
});

parser.loadPDF(checksPdfPath)
