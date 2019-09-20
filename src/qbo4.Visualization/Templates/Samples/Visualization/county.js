document.addEventListener("qbo4.visualization.ready", function () {
    var cssClassNames = {
        'headerRow': 'cssHeaderRow',
        'tableRow': 'cssTableRow',
        'headerCell': 'cssHeaderCell',
        'tableCell': 'cssTableCell'
    };

    var json = qbo4.get('county.json');
    var data = new google.visualization.DataTable(json);

    /*var map = new google.visualization.Map(document.getElementById('geo_chart2'));
    var url = 'https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/';

    var options = {
        zoomLevel: 10,
        showTooltip: true,
        mapType: "normal",
        showInfoWindow: true,
        useMapTypeControl: true,
        icons: {
            blue: {
                normal: url + 'Map-Marker-Ball-Azure-icon.png',
                selected: url + 'Map-Marker-Ball-Right-Azure-icon.png'
            },
            green: {
                normal: url + 'Map-Marker-Push-Pin-1-Chartreuse-icon.png',
                selected: url + 'Map-Marker-Push-Pin-1-Right-Chartreuse-icon.png'
            },
            pink: {
                normal: url + 'Map-Marker-Ball-Pink-icon.png',
                selected: url + 'Map-Marker-Ball-Right-Pink-icon.png'
            }
        }
    };
    map.draw(data, options);
    */
    var url = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=';
    /* https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|0c5e03| 
     green - 19660c
     greenyellow - b6de28
     yellow - f7f70f
     orange - e8b407
     red - e80707
     */

    const db = new qbo4.visualization.dashboard({
        url: 'county.json',
        packages: ['bar', 'core', 'table', 'geochart', 'map'],
        mapsApiKey: 'AIzaSyBA0IJ16EhbYrofmpILRPfaAf9dOM1-PP8',
        charts: [
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
                        'ZipCode',
                        'Increase'
                    ]
                }
            },
            {
                chartType: 'Map',
                containerId: 'geo_chart2',
                options: {
                    showTooltip: true,
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
    db.draw();
    window.db = db;


});