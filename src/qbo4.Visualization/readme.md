# qbo4.Visualization

The qbo4 visualization library provides sugar over Google's Visualization library.

## qbo4.visualization.dashboard

The purpose of the dashboard class is to render multiple charts, including rollup data, based on a common data table.

For example, give a Sql DataTable of loan records, we might want to render:

- A [pie chart](https://developers.google.com/chart/interactive/docs/gallery/piechart) by State,
- A [bar chart](https://developers.google.com/chart/interactive/docs/gallery/barchart) by Status, and
- A [table](https://developers.google.com/chart/interactive/docs/gallery/table) of Loans matching the selected State and Status

To create a dashboard:

``` javascript
document.addEventListener("qbo4.visualization.ready", function () {
    const db = new qbo4.visualization.dashboard({
        charts: [ ... array of charts here ... ]
    });
    // fetch the data to draw the chart with
    db.draw('api/loan/search');
});
```

> The `qbo4.visualization.ready` event is fired after the required google javascript code has been loaded.

The dashboard class supports native Google charts json, with some extra features thrown in.

A [working sample](https://jsfiddle.net/epatrick/9upwjhco/3/) of this code is available on JSFiddle.

### Chart Dimension

Adding a dimension property to a chart tells the dashboard to create a `DataView`, grouping by the `State` column.

``` javascript
{
    chartType: 'PieChart',
    containerId: 'state_chart',
    dimension: 'State',
    options: {
        height: 500,
        pieHole: 0.2,
        pieSliceText: 'value',
        legend: 'left'
    }
}
```

By default, a dimension with no defined facts will assume you want a count of rows matching your dimension value. 
If you wish different facts, include a `facts` array:

``` javascript
{
    chartType: 'BarChart',
    containerId: 'servicerByType_chart',
    dimension: 'Servicer',
    pivot: 'LoanType',
    facts: [{ columnId: 'UPBAmount', aggregation: google.visualization.data.sum, type: 'number', label: 'UPB' }],
    options': { ... }
}
```

Facts can be inferred from simple strings:

``` javascript
{
    chartType: 'BarChart',
    containerId: 'servicerByType_chart',
    dimension: 'Servicer',
    pivot: 'LoanType',
    facts: ['sum:UPBAmount'],
    options': { ... }
}
```

> The common Google Visualization [aggregate functions](https://developers.google.com/chart/interactive/docs/reference#data_aggregation_functions) are supported with this syntax: `{aggregate function}:{columnId}`. 
> If you need to use a [custom aggreate function](https://developers.google.com/chart/interactive/docs/reference#creating_an_aggregation_function), you must use the 'long format' for facts.


### Chart Pivot

To create a pivot table (using two dimensions):

``` javascript
{
    chartType: 'BarChart',
    containerId: 'servicerByType_chart',
    dimension: 'Servicer',
    pivot: 'LoanType',
    options: { ... }
}
```

To add additional columns (such as a total) to a pivot table, use custom `facts`:

``` javascript
{
    chartType: 'Table',
    containerId: 'status_chart',
    dimension: 'Servicer',
    pivot: 'Status',
    filters: ['State'],
    options: {
        page: 'enable',
        pageSize: 10,
        allowHtml: true
    },
    facts: [
        { columnId: 'LoanID', aggregation: google.visualization.data.count, type: 'number', label: 'Loans' },
        { columnId: 'UPBAmount', aggregation: google.visualization.data.sum, type: 'number', label: 'UPB' }
    ]
}
```

### Chart Filter

Adding a filter property to a chart tells the dashboard to filter the dataview whenever a matching filter is set, 
typically by a user clicking on a chart selection.

``` javascript
{
    chartType: 'PieChart',
    containerId: 'city_chart',
    dimension: 'City',
    filters: ['State'],
    options: {
        pieSliceText: 'value',
        legend: 'right'
    }
}
```

In this case, the City chart will respond to the user clicking on a slice of the State pie. 
However, the State chart will not respond to a user clicking on a slice of the State pie, 
because no `filters` property has been set on the State chart.

Be careful about creating 2-way filters: a City chart that responds to a State filter makes sense, 
but a State chart that responds to a City filter is unlikely to be intuitive to a user.

### Custom column displays

When displaying the loan data in a table, it's useful to create calculated columns that include hyperlinks.

``` javascript
{
    chartType: 'Table',
    filters: ['State', 'City'],
    options: {
        title: 'qbo4 Demo',
        legend: 'none',
        page: 'enable',
        pageSize: 8,
        allowHtml: true
    },
    view: {
        columns: [
            {
                label: 'Loan', type: 'string', calc: (table, row) => {
                    const data = qbo4.visualization.getRow(table, row);
                    return `<a target="_blank" href="/api/loan/${data.LoanID}">${data.Loan}</a>`;
                }
            },
            'Status',
            'UPBAmount',
            {
                label: 'Address', type: 'string', calc: (table, row) => {
                    const data = qbo4.visualization.getRow(table, row);
                    return `<a target="_blank" href="/api/property/${data.PropertyID}">${data.Address}<br/>${data.City}, ${data.State} ${data.PostalCode}</a>`;
                }
            }]
    },
    containerId: 'table_div'
}
```

> In the example above:
> - the first column renders the `Loan` number, with a hyperlink to the summary page for the `LoanID`.
> - the last column presents the `Address, City, State` and `PostalCode` in a single cell, hyperlinked to the `Property` summary page.

### Working with SQL Cubes

The examples above work with 'raw data': individual rows are grouped into rollups or pivot tables.
If your raw data is more than 10,000 rows, browser performance will likely suffer.
In such situations, roll the data up server-side before delivering to the client.
For SQL-based queries, the WITH CUBE provides an elegant way of summarizing n-dimensional data.

In the examples below, we assume that the `DataTable` we're working with is based on a SQL CUBE,
a sample of which is provided in [loans.dashboard.json](loans.dashboard.json).
Specifically, each dimension includes a `Group` column: `LoanTypeGroup`, `StatusGroup`, `ServicerGroup`.

To render a pie chart by `LoanType`, we use `filters` to tell the chart to:

- Use the detail data for the `LoanType` dimension, and
- Use only the rollup data for the other dimensions

``` javascript
charts: [{
    chartType: 'PieChart',
    containerId: 'loantype_chart',
    filters: [
        { columnId: 'ServicerIDGroup', value: 1 },
        { columnId: 'LoanTypeGroup', value: 0 },
        { columnId: 'StatusGroup', value: 1 }
    ],
    options: {
        pieHole: 0.2,
        pieSliceText: 'value',
        legend: 'left'
    },
    view: {
        columns: [
            'LoanType',
            'LoanCount'
        ]
    }
}]
```

If you want the chart above to respond to a `Status` filter, the `{ columnId: 'StatusGroup', value: 1}` filter won't work.
Instead, leverage Google's `test` property with the `qbo4.visualization.cubeFilter` function to determine which rows to filter:

``` javascript
charts: [{
    chartType: 'PieChart',
    containerId: 'loantype_chart',
    filters: [
        'Status',
        { columnId: 'ServicerIDGroup', value: 1 },
        { columnId: 'LoanTypeGroup', value: 0 },
        {
            columnId: 'StatusGroup',
            test: (value, row, col, table) => qbo4.visualization.cubeFilter(table, row, value, 'Status'),
        }
    ],
    options: {
        pieHole: 0.2,
        pieSliceText: 'value',
        legend: 'left'
    },
    view: {
        columns: [
            'LoanType',
            'LoanCount'
        ]
    }
}]
```

The `qbo4.visualization.cubeFilter` function does the following:

- If there is no `Status` property on `dashboard.filters`, the `defaultValue` will be used,
- If there is a `Status` property on `dashboard.filters`, the row must have a `Status` column matching the `dashboard.filters['Status']`

``` javascript
function (table, row, value, filter, defaultValue = 1) {
    var current = (table.dashboard) ? table.dashboard.filters[filter] : undefined;
    return (current) ? table.getValue(row, table.getColumnIndex(filter)) === current : value === defaultValue;
};
```

## qbo3 Integration

### Fetching data formatted for Google Visualizations

Source data is often formatted as 'simple' JSON arrays, rather than Google Visualization objects. E.g.:

``` javascript
[
  { FisrtName: 'Adam', LastName: 'Ant' },
  { FisrtName: 'Bobby', LastName: 'Banana' }
]
```

instead of:

``` javascript
{
  "cols": [
    { "id": "FistName", "label": "FirstName", "type": "string" },
    { "id": "LastName", "label": "LastName", "type": "string" }
  ],
  "rows": [
    { "c": [ { "v": "Adam" }, { "v": "Ant" } ] },
    { "c": [ { "v": "Bobby" }, { "v": "Banana" } ] }
  ]
}
```

Such data must be formatted for Google Visualizations. The `qbo3.Report.Google` Nuget package provides a `Gvis.ashx` 
handler that does this for you:

```
/Report/GVis.ashx/{ClassName}/{Operation}?{Parameters}
```

will convert and `DataSet` or `DataReader` to Google Visualization JSON.

From the client side, you can instead convert such data with:

``` javascript
qbo4.visualization.getDataTable(url)
```

For example:

``` javascript
document.addEventListener("qbo4.visualization.ready", function () {
    const db = new qbo4.visualization.dashboard({
        charts: [ ... array of charts here ... ]
    });
    // fetch the data to draw the chart with
    db.draw(qbo4.visualization.getDataTable('api/loan/search'));
});
```

### Connecting a qbo4.Visualization.Dashboard to a qbo3.ObjectBind panel

Add an event listener to the dashboard.container:

``` javascript
db.container.addEventListener('filtered', function(e) {
    console.log(db.filters);
    var panel = qbo3.getObject('search');
    panel.refresh(db.filters);
});
```

> In the example above, the code simply passes the array of filters to the `ObjectBind.refresh` method. 
> You may need to manipulate the object being passed to refresh to handle your specific use cases.

### When to use a Google Table visualization

Consider using a Table visualization instead of a qbo3 search panel if you are doing a single-page application that does
not need to leverage the sugar provided by qbo3's standard UI (labels, option menus, etc.).