document.addEventListener("qbo4.visualization.ready", function () {
    var cssClassNames = {
        'headerRow': 'cssHeaderRow',
        'tableRow': 'cssTableRow',
        'headerCell': 'cssHeaderCell',
        'tableCell': 'cssTableCell'
    };

    const db = new qbo4.visualization.dashboard({
        url: 'properties.json',
        packages: ['bar', 'core', 'table', 'geochart'],
        mapsApiKey: 'AIzaSyBA0IJ16EhbYrofmpILRPfaAf9dOM1-PP8',
        charts: [
            {
                chartType: 'GeoChart',
                containerId: 'geo_chart2',
                options: {
                    region: 'US', // United States
                    resolution: 'provinces',
                    colorAxis: { colors: ['green', 'yellow', 'red'] } 
                }
            },
            {
                chartType: 'Table',
                containerId: '2',
                options: {
                    width: '100%',
                    height: '100%',
                    legend: 'none',
                    allowHtml: true,
                    'cssClassNames': cssClassNames
                },
                view: {
                    columns: [
                        'State',
                        'YTDIncrease'
                    ]
                }
            }
        ]
    });
    db.draw();
    window.db = db;
});