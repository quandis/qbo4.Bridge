# qbo4.Visualization

The qbo4 visualization library provides sugar over Google's Visualization library.

## qbo4.visualization.dashboard

The purpose of the dashboard class is to render multiple charts, including rollup data, based on a common data table.

For example, give a Sql DataTable of loan records, we might want to render:

- A pie chart by State,
- A bar chart by Status, and
- A table of Loans matching the selected State and Status

To load create a dashboard:

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

### Chart dimension

Adding a dimension property to a chart tells the dashboard to create a `DataView`, grouping by the `State` column.

``` javascript
{
    'chartType': 'PieChart',
    'containerId': 'state_chart',
    'dimension': 'State',
    'options': {
        'height': 500,
        'pieHole': 0.2,
        'pieSliceText': 'value',
        'legend': 'left'
    }
}
```

### Filter dimension

Adding a filter property to a chart tells the dashboard to filter the dataview whenever a matching filter is set, 
typically by a user clicking on a chart selection.

``` javascript
{
    'chartType': 'PieChart',
    'containerId': 'city_chart',
    'dimension': 'City',
    'filters': ['State'],
    'options': {
        'pieSliceText': 'value',
        'legend': 'right'
    }
}
```

In this case, the City chart will respond to the user clicking on a slice of the State pie. 
However, the State chart will not respond to a user clicking on a slice of the State pie, because no `filters` property has been set on the State chart.

### Custom column displays

When displaying the loan data in a table, it's useful to create calculated columns that include hyperlinks.

``` javascript
{
    'chartType': 'Table',
    'filters': ['State', 'City'],
    'options': {
        'title': 'qbo4 Demo',
        'legend': 'none',
        'page': 'enable',
        'pageSize': 8,
        'allowHtml': true
    },
    'view': {
        columns: [
            {
                label: 'Loan', type: 'string', calc: (table, row) => {
                    const data = qbo4.visualization.getRow(table, row);
                    return `<a target="_blank" href="/api/loan/${data.LoanID}">${data.Loan}</a>`;
                }
            },
            3,
            4,
            {
                label: 'Address', type: 'string', calc: (table, row) => {
                    const data = qbo4.visualization.getRow(table, row);
                    return `<a target="_blank" href="/api/property/${data.PropertyID}">${data.Address}<br/>${data.City}, ${data.State} ${data.PostalCode}</a>`;
                }
            }]
    },
    'containerId': 'table_div'
}
```

In the example above, the first column renders the `Loan` number, with a hyperlink to the summary page for the `LoanID`.

The `Address` columns presents the `Address, City, State` and `PostalCode` in a single cell, hyperlinked to the `Property` summary page.
