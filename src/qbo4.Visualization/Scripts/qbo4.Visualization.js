(function () {
    'use strict';
    if (!window.qbo4)
        window.qbo4 = {};

    if (!qbo4.visualization)
        qbo4.visualization = {};

    /* @description Dashboard for google visualations, enabing filtering between charts.
     */
    qbo4.visualization.dashboard = class {

        constructor(options) {
            // Establish defaults
            this.options = Object.assign({
                packages: ['table', 'corechart'],
                filters: {},
                charts: [],
                // Value to use for a label if the underlying data is null or empty.
                nullLabel: '--',
                // Array of styles to be removed after the chart has rendered.
                removeStyles: ['chartLoading'],
                // Array of styles to be added after the chart has rendered.
                addStyles: []
            }, options);

            this._table = null;
            this._columns = null;

            // Set the current filter from the default filter
            this.filters = this.options.filters;

            // Set up charts, ensuring defaults are set.
            this.charts = [];
            this.options.charts.forEach(chart => { this.addChart(chart); });
        }

        get columns() {
            return this._columns;
        }


        set table(dataTable) {
            var dashboard = this;
            dashboard._table = dataTable;
            dashboard._columns = {};
            for (var i = 0; i < dataTable.getNumberOfColumns(); i++)
                dashboard._columns[dataTable.getColumnId(i)] = i;

            // calculate column indexes from column labels
            dashboard.charts.forEach(chart => {
                if (chart.view && chart.view.columns) {
                    chart.view.columns.forEach((col, index, cols) => {
                        if (typeof (col) === "string")
                            cols[index] = dashboard._columns[col];
                    });
                }
                if (chart.dimension && !chart.dimensionIndex) {
                    chart.dimensionIndex = chart.dimension.split(',');
                    chart.dimensionIndex.forEach((d, index, dimensions) => {
                        if (typeof (d) === "string")
                            dimensions[index] = dashboard._columns[d];
                    });
                }
                if (chart.dimension && !chart.facts && chart.pivot === undefined)
                    chart.facts = [{ column: 0, aggregation: google.visualization.data.count, type: 'number', label: 'Total' }];
                if (chart.facts) {
                    chart.facts.forEach((fact, index, facts) => {
                        if (typeof (fact) === "string") {
                            var parts = fact.split(':');
                            var aggregation = google.visualization.data.count;
                            switch (parts[0]) {
                                case 'sum':
                                    aggregation = google.visualization.data.sum;
                                    break;
                                case 'avg':
                                    aggregation = google.visualization.data.avg;
                                    break;
                                case 'max':
                                    aggregation = google.visualization.data.avg;
                                    break;
                                case 'min':
                                    aggregation = google.visualization.data.avg;
                                    break;
                            }
                            facts[index] = { columnId: parts[1] || parts[0], type: 'number', label: parts[1] || parts[0], aggregation: aggregation };
                        }
                    });
                }
            });
        }

        get table() {
            return this._table;
        }

        /* @description Add a chart to the list of charts in the dashboard, setting default values if not specified.
         */
        addChart(chart) {
            this.charts.push(Object.assign({
                aggregation: google.visualization.data.count,
                filters: [],
                nullLabel: this.options.nullLabel
            }, chart));
        }

        loadCharts(packages) {
            return new Promise(function (resolve, reject) {
                google.charts.load('current', { 'packages': packages });
                google.charts.setOnLoadCallback(function () { resolve(); });
            });
        }

        getDataTable(url) {
            return qbo4.visualization.getDataTable(url);
        }

        /* @description Filter the dashboard table, returning a view with just the filtered rows.
         * @param chart {object} Chart to calculate view for. This is where chart.Filters are applied.
         * @returns {google.visualization.DataView}
         */
        filter(chart) {
            var view = (chart.mapView) ? chart.mapView(this.table) : new google.visualization.DataView(this.table);
            var filters = [];
            chart.filters.forEach(f => {
                if ((f in this.columns) && (f in this.filters))
                    filters.push({ column: view.getColumnIndex(f), value: this.filters[f] });
            });
            if (filters.length > 0)
                view.setRows(view.getFilteredRows(filters));
            return view;
        }

        /* @description Renders each chart in the dashboard based on the datatable
         * @param dataTable {google.visualization.DataTable} to render charts with.
        */
        render() {
            this.charts.forEach(chart => {
                try {
                    this.renderChart(chart);
                }
                catch (err) {
                    console.log(err);
                }
            });
        }

        /* @description Draws each chart impacted by changes to the dashboard.filters.
         * @param filter {array} a list of the filters that apply to the chart.
        */
        redraw(filter, source) {
            var dashboard = this;
            // figure out which charts listen to the filter
            dashboard.charts.filter(chart => {
                return chart.filters && chart.filters.includes(filter) && (source != chart);
            }).forEach(chart => {
                // clear out downstream filters.
                if (chart.dimension in dashboard.filters && chart.dimension != filter)
                    delete dashboard.filters[chart.dimension];

                dashboard.renderChart(chart);
            });
        }

        renderChart(chart) {
            var dashboard = this;

            var filteredView = dashboard.filter(chart);

            // Calcualte a rollup by dimension if required.
            var view = (chart.dimensionIndex)
                ? dashboard.group(filteredView, chart)
                : filteredView;

            var wrapper = new google.visualization.ChartWrapper(Object.assign({ dataTable: view }, chart));
            google.visualization.events.addListener(wrapper, 'select', function () {
                var data = wrapper.getDataTable();
                var selection = wrapper.getChart().getSelection()[0];
                var column = data.getColumnId(0);
                if (selection) {    // add filter
                    if (selection.row)
                        dashboard.filters[column] = data.getValue(selection.row, 0);
                    if (selection.column)
                        dashboard.filters[chart.pivot] = data.getColumnId(selection.column);
                }
                else {  // remove filter
                    delete dashboard.filters[column];
                    if (chart.pivot)
                        delete dashboard.filters[chart.pivot];
                }
                dashboard.redraw(column, chart);
            });
            try {
                wrapper.draw();
            }
            catch (err) {
                console.log(ex);
            }
            var el = document.getElementById(chart.containerId);
            dashboard.options.removeStyles.forEach(style => { el.classList.remove(style); });
            dashboard.options.addStyles.forEach(style => { el.classList.remove(style); });
        }

        /* @description Uses google.visualization.data.group to create a rollup based on chart.dimension, and optional pivot based on chart.pivot.
         * @param view {DataTable} filtered table to group.
         * @param chart {object} options including chart.dimension, chart.pivot.
         */
        group(view, chart) {
            var viewColumns = chart.dimensionIndex;
            var groupColumns = [];
            if (chart.facts) {
                chart.facts.forEach((fact, index, facts) => {
                    if (fact.columnId)
                        viewColumns.push(view.getColumnIndex(fact.columnId));
                    if (fact.column === undefined)
                        facts[index].column = viewColumns.length - 1;
                });
            }
            var columnCount = viewColumns.length;
            if (chart.pivot) {
                var pivotIndex = view.getColumnIndex(chart.pivot);
                var distinctValues = view.getDistinctValues(view.getColumnIndex(chart.pivot));
                for (var i = 0; i < distinctValues.length; i++) {
                    viewColumns.push({
                        type: 'number',
                        label: distinctValues[i] || chart.nullLabel,
                        calc: (function (x) {
                            return function (table, row) {
                                return (table.getValue(row, pivotIndex) === x) ? 1 : 0;
                            };
                        })(distinctValues[i])
                    });

                    groupColumns.push({
                        column: i + columnCount,
                        type: 'number',
                        id: distinctValues[i],
                        label: distinctValues[i] || chart.nullLabel,
                        aggregation: google.visualization.data.sum
                    });
                }
            } // else if (chart.facts) {
            if (chart.facts) {
                groupColumns = groupColumns.concat(chart.facts);
            } // else
                //groupColumns.push({ column: 0, aggregation: chart.aggregation, type: 'number', label: 'Total' });

            if (!chart.view || !chart.view.columns)
                view.setColumns(viewColumns);
            return google.visualization.data.group(view, [0], groupColumns);
        }

        async draw() {
            await this.loadCharts();
            var json = await qbo4.get(this.options.url);
            this.table = new google.visualization.DataTable(json);
            this.render();
        }
    };

    /* @description Infer DataColumn objects from an array of objects. Used to convert a JSON object to a simple array.
     * @param data {object} object to be converted
     * @param scanRows {number} number of rows to scan to infer columns and data types. Default is 10.
     * @returns array of Goggle Visualization DataColumn objects {{ label: string, id: string, type: string}}
    */
    qbo4.visualization.inferColumns = function (data, scanRows = 10) {
        if ((scanRows === 0) || (scanRows > data.length))
            scanRows = data.length;
        for (var r = 0; r < scanRows; r++) {
            var row = data[r];
            var columns = [];
            for (var c in row) {
                if (row.hasOwnProperty(c)) {
                    var isNumber = true;
                    for (var i = 0; i < scanRows; i++) {
                        if (data[i][c] && isNaN(data[i][c])) {
                            isNumber = false;
                            break;
                        }
                    }
                    var column = { label: c, id: c, type: (isNumber) ? 'number' : 'string' };
                    if (!columns.includes(column))
                        columns.push(column);
                }
            }
        }
        return columns;
    };

    /* @description Creates a google visualization DataTable from a serialized DataSet or IDataReader returned by QBO
     * @param url {string} url to fetch data from (e.g. '/api/loan/search')
     * @param options {object} options to pass to qbo4.get(url, options)
     * @returns Promise calling resolve(dataTable)
    */
    qbo4.visualization.getDataTable = function (url, options = {}) {
        return new Promise(function (resolve, reject) {
            qbo4.get(url, options).then(function (json) {
                // Get the first array from a serialized dataset or data reader
                var data = qbo4.getArray(json);
                // Calculate the columns
                var columns = qbo4.visualization.inferColumns(data);
                // Ensure the array is structured like a table
                var rows = qbo4.arrayToTable(data, columns.map(c => c.id));
                // Add the column
                rows.unshift(columns);
                // Create the DataTable
                var dt = google.visualization.arrayToDataTable(rows);
                resolve(dt);
            });
        });
    };

    qbo4.visualization.getRow = function (view, row) {
        var data = {};
        for (var i = 0; i < view.getNumberOfColumns(); i++)
            data[view.getColumnId(i)] = view.getValue(row, i);
        return data;
    };

    // Only load for pages that have the google API already loaded.
    if (google && google.charts) {
        google.charts.load('current', { 'packages': ['table', 'corechart'] })
            .then(() => { document.dispatchEvent(new Event('qbo4.visualization.ready')); });
    }
})();
