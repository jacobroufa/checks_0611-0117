# RPS 205 FOIA Request by Allison Wang on January 26, 2017

Consolidated Check Register report for all checks and/or fund transfer(s) issued from June 1, 2011 to January 24, 2017

## Story

On my initial browsing of RPS' [FOIA portal](http://www.boarddocs.com/il/rps205/Board.nsf/Public?open&id=library) I just happened to look at the (rather long) list of requests from 2016-2017, and simply clicked on the most recent result. This happened to be the [request by Allison Wang](http://www.boarddocs.com/il/rps205/Board.nsf/files/AJENPU5FE10B/$file/PDF%201.pdf), containing this consolidated check register report. Given the current tension between the school board and support staff unions (bus drivers, food service, and paraprofessionals), this seemed fortuitous and I thought I should investigate further. To that end, this application is a parser that digs through the tabular data in the PDF and formats it as JSON.

## Data

I have accounted for missing fields in the `VendorID` column, where employee IDs have been redacted. The results are available in the `output` folder. Data has been split into two sets -- `vendor` and `employee`.

## Organization

**TODO** : I need to organize this dataset by year.

## License

Copyright (c) 2017 Jacob M. Roufa [jacob.roufa@gmail.com](jacob.roufa@gmail.com)
Licensed under the MIT license.
