document.addEventListener("qbo4.visualization.ready", function () {
    const db = new qbo4.visualization.dashboard({
        url: 'loans.dashboard.json',
        packages: ['bar', 'core'],
        charts: [{
            chartType: 'PieChart',
            containerId: 'servicer_chart',
            filters: [
                { columnId: 'ServicerIDGroup', value: 0 },
                { columnId: 'LoanTypeGroup', value: 1 },
                { columnId: 'StatusGroup', value: 1 }
            ],
            options: {
                pieHole: 0.2,
                pieSliceText: 'value',
                legend: 'left'
            },
            view: {
                columns: [
                    'Servicer',
                    'LoanCount'
                ]
            }
        }, {
            chartType: 'BarChart',
            containerId: 'type_chart',
            filters: [
                'Servicer',
                {
                    columnId: 'ServicerIDGroup',
                    // if we have a servicer filter, use it, otherwise use the group row
                    test: (value, row, col, table) => qbo4.visualization.cubeFilter(table, row, value, 'Servicer'),
                },
                { columnId: 'LoanTypeGroup', value: 0 },
                { columnId: 'StatusGroup', value: 0 }
            ],
            dimension: 'LoanType',
            pivot: 'Status',
            pivotValue: 'LoanCount',
            options: {
                isStacked: true
            }
        }, {
            chartType: 'Table',
            dimension: 'LoanType',
            pivot: 'Status',
            pivotValue: 'LoanCount',
            options: {
                width: '100%',
                height: '100%',
                title: 'qbo4 Demo',
                legend: 'none',
                page: 'enable',
                pageSize: 25,
                allowHtml: true
            },
            facts: ['sum:LoanCount'],
            filters: [
                { columnId: 'ServicerIDGroup', value: 1 },
                { columnId: 'LoanTypeGroup', value: 0 },
                { columnId: 'StatusGroup', value: 0 }
            ],
            containerId: 'pivot_chart'
        }, {
            chartType: 'Table',
            options: {
                width: '100%',
                height: '100%',
                title: 'qbo4 Demo',
                legend: 'none',
                page: 'enable',
                pageSize: 25,
                allowHtml: true
            },
            filters: [
                { columnId: 'ServicerIDGroup', value: 1 },
                { columnId: 'LoanTypeGroup', value: 0 },
                { columnId: 'StatusGroup', value: 0 }
            ],
            containerId: 'table_chart'
        }]
    });
    db.draw();
    window.db = db;
});