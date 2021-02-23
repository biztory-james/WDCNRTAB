/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "appname",
        alias: "name",
        dataType: tableau.dataTypeEnum.string
    },
        
        {
        id: "begintimeseconds",
        alias: "starttime",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "value",
        alias: "title",
        dataType: tableau.dataTypeEnum.float
    }];

    var tableSchema = {
        id: "uniquerecords",
        alias: "Daily Unique UUIDs",
        columns: cols
      };
      console.log(tableSchema)

    schemaCallback([tableSchema]);
};

    myConnector.getData = function(table, doneCallback) {
    console.log("Hello get data")
    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/insights-api.newrelic.com/v1/accounts/2034879/query?nrql=SELECT count(*) FROM MobileCrash where appName in ('MobilyiOS', 'Mobily-Revamp-Android') FACET appName, timestamp SINCE 8 hours ago limit MAX",
      crossDomain: true,
      dataType:'json',
      headers: {
        'X-Query-Key': 'qGLl8M4lavqUwpnodYyPTYLO6zrTX4z-',
        'Accept':'Application/json',
        'Access-Control-Allow-Origin':'*'
      },
      success: function dataRetrieved(response) {
        var processedData = [],
            // Determine if more data is available via paging.
            moreData = false, // @todo Implement paging.
            events;
      //  console.log(response);
        // Abort if the response represents an unsupported query.
      // if (!isValidInsightsResponse(response)) { 
      //    tableau.abortWithError('NRQL queries with aggregation are unsupported at this time.');
      //    registerData(processedData);
      //    return;
      //  }
        var feat = response.facets, tableData  = [];
    //    console.log(feat);
        // You may need to perform processing to shape the data into an array of
        // objects where each object is a map of column names to values.
         for (var i = 0, len = feat.length; i < len; i++) {
             tableData.push({
                 "appname":feat[i].name[0],
                 "begintimeseconds":feat[i].name[1],
                 "value":feat[i].results[0].count
             });
         }


        console.log(tableData);
        table.appendRows(tableData);
        doneCallback();

        // Once you've retrieved your data and shaped it into the form expected,
        // call the registerData function. If more data can be retrieved, then
        // supply a token to inform further paged requests.
        // @see buildApiFrom()
   //     if (moreData) {
     //     registerData(processedData, response.meta.page);
      //  }
        // Otherwise, just register the response data with the callback.
     //   else {
     //     registerData(processedData);
       // }
      }
    });
    
    
    
};

    tableau.registerConnector(myConnector);
	$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});
})();

