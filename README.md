uptime-api-jquery
=================

Welcome to the RESTful API for up.time 7.2+.  This repository contains examples that use D3 charts
to render status information retrieved from an up.time monitoring station.  Using the up.time API, you
can create your own dashboards for visualizing the current state of your environment.

More information about D3 and its powerful graphing can be found [http://d3js.org].  More information about up.time and
monitoring can be found at [http://www.uptimesoftware.com]

Thanks.

The up.time crew

Setting up
----------

To get the API working with your up.time monitoring station, clone the code in this repository to your monitoring station's /GUI directory (maybe into a subdirectory called /dashboards or something informative). 

On your monitoring station (Linux example), clone from Git:

    $ cd /usr/local/uptime/GUI/dashboards
    $ git clone https://github.com/uptimesoftware/uptime-api-jquery.git

Browse to:

    http://<uptimemonitoringstation>:9999/GUI/dashboards/uptime-api.html

If you see this kind error message in your browser when trying to load the uptime-api.html file:

    XMLHttpRequest cannot load https://uptime-demo.uptimesoftware.com:9997/api/v1/elements?_=1378927010639. Origin null is not allowed by Access-Control-Allow-Origin.

This means that you are trying to access the up.time monitoring station API from a machine that isn't the up.time core.  This commonly happens when you load the examples from a file rather than via http:// from the monitoring station.

Using the API
-------------

Using the jQuery API is relatively straightforward: include the API .js file and make a call.  Ensure that you edit the uptimeSetAPIInfo(...) call to contain the hostname of your monitoring station.

```javascript
<script type='text/javascript' src='uptime-api-v1.0.js'></script>

$(document).ready(function () {
    // -- set up some auth information
    uptimeSetAPIInfo( '', 'username', 'password' );

    // -- load all the elements that the up.time monitoring station is looking after
    // -- pass in a callback function, remember ajax is asynchronous so we can't wait for results (and don't want to block)
    uptimeLoadElements(displayResults);
}
```

The uptimeLoadElements function requires a callback, which is a function that will be triggered
when the monitoring station returns a JSON structure with information about each element.

```json
[
 {
 "description": "Default self-monitoring host",
 "groupId": 1,
 "hostname": "win-dleith",
 "id": 1,
 "isMonitored": true,
 "monitors": [{
    "elementId": 1,
    "id": 8,
    "isHidden": false,
    "isMonitored": true,
    "name": "Default Agent Service Check"
    }],
 "name": "win-dleith",
 "tags": [],
 "type": "Server",
 "typeName": "Server",
 "typeOs": "Windows 7/Server 2008 R2",
 "typeSubtype": "Windows",
 "typeSubtypeName": "Microsoft Windows"
 }
]
```

The displayResults function can do anything you like with the returned data.

```javascript
    // -- this function is a callback from the up.time API uptimeLoadElements(), once the
    //    JSON data structure is returned from the monitoring station, this function is called.
    function displayResults(data) {
        // -- let's populate a table with the results
        $.each(data, function (index, item) {
            console.log("up.time element name is " + item.name ", and OS is " + item.typeOs );
        }
    }
```
