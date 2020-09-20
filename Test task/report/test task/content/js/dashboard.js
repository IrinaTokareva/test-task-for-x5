/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3121504772599663, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.43279286193994054, 500, 1500, "U01_T07_Step5-0"], "isController": false}, {"data": [0.14597395189656812, 500, 1500, "UC01_T01_OpenChallengePage"], "isController": false}, {"data": [0.16559531804662764, 500, 1500, "U01_T07_Step5"], "isController": false}, {"data": [0.40250549870899877, 500, 1500, "U01_T05_Step4-1"], "isController": false}, {"data": [0.40145357177010615, 500, 1500, "U01_T05_Step4-0"], "isController": false}, {"data": [0.4238401073619632, 500, 1500, "U01_T06_GetOneTimeToken"], "isController": false}, {"data": [0.38261947915672995, 500, 1500, "U01_T04_Step3-1"], "isController": false}, {"data": [0.380568539540208, 500, 1500, "U01_T04_Step3-0"], "isController": false}, {"data": [0.15501577890408338, 500, 1500, "U01_T05_Step4"], "isController": false}, {"data": [0.15422294084078372, 500, 1500, "U01_T02_Step1"], "isController": false}, {"data": [0.13715971825623452, 500, 1500, "U01_T03_Step2"], "isController": false}, {"data": [0.3931086997905959, 500, 1500, "U01_T03_Step2-0"], "isController": false}, {"data": [0.350847134970493, 500, 1500, "U01_T03_Step2-1"], "isController": false}, {"data": [0.15324811599732902, 500, 1500, "U01_T04_Step3"], "isController": false}, {"data": [0.4123073996575994, 500, 1500, "U01_T02_Step1-0"], "isController": false}, {"data": [0.43725414947711794, 500, 1500, "U01_T07_Step5-1"], "isController": false}, {"data": [0.37987445311013884, 500, 1500, "U01_T02_Step1-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 178100, 0, 0.0, 1665.306973610317, 211, 9743, 2485.0, 4793.0, 4988.0, 5192.0, 53.92283312563505, 120.38425298104556, 107.42942318662523], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["U01_T07_Step5-0", 10423, 0, 0.0, 1175.9543317662858, 213, 3605, 1176.0, 2030.6000000000004, 2191.0, 2512.76, 3.1684125411136717, 3.4963927455648913, 5.382458668791], "isController": false}, {"data": ["UC01_T01_OpenChallengePage", 10519, 0, 0.0, 2021.9734765662124, 226, 9743, 1982.0, 2964.0, 3186.0, 3826.0, 3.1854820271161164, 10.018655304664904, 3.8805835720211475], "isController": false}, {"data": ["U01_T07_Step5", 10423, 0, 0.0, 2348.3156480859607, 429, 6051, 2313.0, 4049.0, 4302.0, 4893.76, 3.167080111964471, 9.553818814314699, 9.750223352376937], "isController": false}, {"data": ["U01_T05_Step4-1", 10457, 0, 0.0, 1239.945969207226, 214, 3777, 1210.0, 2105.0, 2305.0, 2602.0, 3.174274564277163, 6.679000161377424, 4.3861479148352185], "isController": false}, {"data": ["U01_T05_Step4-0", 10457, 0, 0.0, 1247.679927321412, 213, 3411, 1203.0, 2129.0, 2325.0, 2617.0, 3.1752577069155454, 3.519450681005024, 6.363138791168733], "isController": false}, {"data": ["U01_T06_GetOneTimeToken", 10432, 0, 0.0, 1192.7740605828192, 211, 3424, 1189.0, 2053.7000000000007, 2204.0, 2511.34, 3.1692042781827383, 3.3363302850400314, 3.5311302472477566], "isController": false}, {"data": ["U01_T04_Step3-1", 10483, 0, 0.0, 1280.80129733855, 213, 3547, 1226.0, 2193.0, 2396.0, 2633.6399999999994, 3.1805295643921463, 6.353982885217106, 4.394799094248408], "isController": false}, {"data": ["U01_T04_Step3-0", 10483, 0, 0.0, 1291.5569970428267, 212, 3856, 1285.0, 2208.6000000000004, 2405.0, 2610.0, 3.181682154717831, 3.5265715289108774, 5.82757119613251], "isController": false}, {"data": ["U01_T05_Step4", 10457, 0, 0.0, 2487.9570622549513, 436, 6342, 2414.0, 4208.0, 4593.0, 5092.0, 3.174008642093723, 10.196506853261212, 10.74641616479318], "isController": false}, {"data": ["U01_T02_Step1", 10514, 0, 0.0, 2509.217709720381, 429, 6666, 2425.0, 4292.0, 4699.25, 5085.85, 3.1871133192478727, 11.060067413838965, 9.653169531754429], "isController": false}, {"data": ["U01_T03_Step2", 10506, 0, 0.0, 2627.4139539310827, 444, 6696, 2559.5, 4423.0, 4868.5999999999985, 5182.0, 3.1856742297876, 12.944823437147974, 9.754625717106459], "isController": false}, {"data": ["U01_T03_Step2-0", 10506, 0, 0.0, 1272.3309537407213, 211, 3803, 1211.0, 2196.0, 2393.0, 2602.0, 3.187122882911306, 3.532602023539387, 5.355150646332048], "isController": false}, {"data": ["U01_T03_Step2-1", 10506, 0, 0.0, 1354.7391966495393, 220, 4008, 1320.0, 2288.0, 2494.0, 2698.0, 3.1862278289372323, 9.415463011715438, 4.402674118131232], "isController": false}, {"data": ["U01_T04_Step3", 10483, 0, 0.0, 2572.6789087093416, 426, 6097, 2498.0, 4389.0, 4794.0, 5098.0, 3.180255536854317, 9.878425707715314, 10.21937864976264], "isController": false}, {"data": ["U01_T02_Step1-0", 10514, 0, 0.0, 1221.8316530340467, 211, 3936, 1193.0, 2104.0, 2300.0, 2586.8500000000004, 3.189437543872209, 3.535167590131794, 5.27179146268807], "isController": false}, {"data": ["U01_T07_Step5-1", 10423, 0, 0.0, 1172.0543029837838, 213, 3715, 1177.0, 2016.6000000000004, 2189.0, 2497.5200000000004, 3.1673033889508124, 6.059323573197892, 4.370336281174676], "isController": false}, {"data": ["U01_T02_Step1-1", 10514, 0, 0.0, 1287.071238348865, 214, 4064, 1236.0, 2200.0, 2406.25, 2630.8500000000004, 3.1876582990383664, 7.528763149867388, 4.385969607948954], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 178100, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
