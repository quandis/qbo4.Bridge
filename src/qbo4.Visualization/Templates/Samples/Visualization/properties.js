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
                        'Increase'
                    ]
                }
            },
            {
                chartType: 'GeoChart',
                containerId: 'geo_chart3',
                options: {
                    region: 'PR', // United States
                    dataMode: 'regions',
                    colorAxis: { colors: ['green', 'yellow', 'red'] }
                }
            }
        ]
    });
    db.draw();
    window.db = db;

    var url = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=';
    const db2 = new qbo4.visualization.dashboard({
        url: 'state.json',
        packages: ['bar', 'core', 'table', 'geochart', 'map'],
        mapsApiKey: 'AIzaSyBA0IJ16EhbYrofmpILRPfaAf9dOM1-PP8',
        charts: [
            {
                chartType: 'Map',
                containerId: 'pr_chart',
                options: {
                    showTooltip: true,
                    zoomLevel: 7,
                    mapType: "normal",
                    showInfoWindow: false,
                    useMapTypeControl: false,
                    icons: {
                        green: {
                            normal: url + '|19660c|'
                        },
                        greenyellow: {
                            normal: url + '|b6de28|'
                        },
                        yellow: {
                            normal: url + '|f7f70f|'
                        },
                        orange: {
                            normal: url + '|e8b407|'
                        },
                        red: {
                            normal: url + '|e80707|'
                        }
                    }
                }
            }
        ]
    });
    db2.draw();
    window.db = db2;
});