document.addEventListener("qbo4.visualization.ready", function () {
    const db = new qbo4.visualization.dashboard({
        url: 'loans.json',
        packages: ['bar', 'core', 'table'],
        charts: [{
            'chartType': 'PieChart',
            'containerId': 'servicer_chart',
            'dimension': 'Servicer',
            'x-view': {
                'columns': ['Servicer', 'UPBAmount']
            },
            'facts': ['count:LoanID'],
            'options': {
                'pieHole': 0.2,
                'pieSliceText': 'value',
                'legend': 'left'
            }
        }, {
            'chartType': 'PieChart',
            'containerId': 'state_chart',
            'dimension': 'State',
            'filters': ['Servicer'],
            'facts': ['count:LoanID'],
            'options': {
                'pieSliceText': 'value',
                'legend': 'right'
            }
        }, {
            'chartType': 'PieChart',
            'containerId': 'upb_chart',
            'dimension': 'Servicer',
                'facts': ["sum:UPBAmount"],
            'filters': ['State'],
            'options': {
                'pieSliceText': 'value',
                'legend': 'right'
            }
        }, {
            'chartType': 'Table',
            'containerId': 'status_chart',
            'dimension': 'Servicer',
            'pivot': 'Status',
            'filters': ['State'],
            'options': {
                'page': 'enable',
                'pageSize': 10,
                'allowHtml': true
            },
            'facts': [
                { columnId: 'LoanID', aggregation: google.visualization.data.count, type: 'number', label: 'Loans' },
                { columnId: 'UPBAmount', aggregation: google.visualization.data.sum, type: 'number', label: 'UPB' }
                // "count:LoanID"
            ],
            'x-view': {
                columns: [
                    'Servicer',
                    'UPBAmount'
                ]
            }
        }, {
            'chartType': 'BarChart',
            'containerId': 'type_chart',
            'dimension': 'Servicer',
            'filters': ['Servicer', 'State'],
            'pivot': 'LoanType',
            'options': {
                'width': '100%',
                'height': '100%',
                'allowHtml': true,
                'isStacked': true
            }
        }, {
            'chartType': 'Table',
            'filters': ['State', 'Servicer', 'LoanType'],
            'options': {
                'width': '100%',
                'height': '100%',
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
                    'Status',
                    'UPBAmount',
                    'LoanType',
                    {
                        label: 'Servicer', type: 'string', calc: (table, row) => {
                            const data = qbo4.visualization.getRow(table, row);
                            return `<a target="_blank" href="/api/organization/${data.ServicerID}">${data.Servicer}</a>`;
                        }
                    },
                    {
                        label: 'Address', type: 'string', calc: (table, row) => {
                            const data = qbo4.visualization.getRow(table, row);
                            return `<a target="_blank" href="/api/property/${data.PropertyID}">${data.Address}<br/>${data.City}, ${data.State} ${data.PostalCode}</a>`;
                        }
                    }]
            },
            'containerId': 'table_div'
        }]
    });
    db.draw();
    window.db = db;
});