<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
	xmlns:qbo3="urn:qbo3-formatting"
  xmlns:security="urn:qbo3-security"
  xmlns:data="urn:qbo3-data"
>
  <xsl:import href="Theme.xslt"/>
  <xsl:output method="html" indent="yes" doctype-system="html"/>
  <xsl:param name="BaseHref"/>

  <xsl:template match="/">

    <html>
      <head>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <xsl:call-template name="Head">
          <xsl:with-param name="Title">Dashboard</xsl:with-param>
        </xsl:call-template>
        <script type="application/javascript">
          <![CDATA[
document.addEventListener("qbo4.visualization.ready", function () {
    const db = new qbo4.visualization.dashboard({
        url: 'templates/samples/visualization/loans.dashboard.json',
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
    db.container.addEventListener('filtered', function(e) {
      console.log(db.filters);
      var panel = qbo3.getObject('search');
      panel.refresh(db.filters);
    });
    window.db = db;
});
        ]]>
        </script>
        <style>
          .chartLoading {
          background: transparent;
          background-image: url("https://digitalsynopsis.com/wp-content/uploads/2016/06/loading-animations-preloader-gifs-ui-ux-effects-18.gif");
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          height: 500px
          }
        </style>
      </head>
      <body>
        <xsl:call-template name="MainMenu"/>
        <div class="container-fluid">
          <ul class="breadcrumb">
            <li>
              <xsl:text>Dashboard</xsl:text>
              <span class="divider">/</span>
            </li>
            <li>
              <xsl:text>Home</xsl:text>
            </li>
            <i class="pull-right icon-question-sign drop-button" data-trigger="help"></i>
          </ul>
        </div>
        <div id="dashboard_div" class="container-fluid">
          <div class="row-fluid">
            <h3>SQL Cube Charting Samples</h3>
          </div>
          <div class="row-fluid">
            <div id="servicer_chart" class="span6 chartLoading">Servicer</div>
            <div id="type_chart" class="span6 chartLoading">Type</div>
          </div>
          <div class="row-fluid">
            <div id="pivot_chart" class="span6 chartLoading">Pivot Data</div>
          </div>
          <div class="row-fluid" >
            <div id="table_chart" class="span12 chartLoading">Raw Data</div>
          </div>
        </div>
        <div id="search" class="container-fluid" data-behavior="ObjectBind" data-objectbind-options="{{ 'class':'qbo3.LoanObject', 'method':'Search', 'render':false, 'listen':['search'], 'cacheKey':'Loan-Home-Search' }}">
          <p>Loan data here...</p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>


