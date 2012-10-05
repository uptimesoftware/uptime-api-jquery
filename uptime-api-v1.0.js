/**
 * (c) 2012 uptime software inc.
 * -- javascript library to access up.time RESTful API.  Each function call has a sample returned
 *    JSON data structure
 */

// -- http://uptime:9997/api/v1
var uptime_url_host = '';
var uptime_api_ver = '/api/v1';
var uptime_user = 'admin';
var uptime_password = 'admin';

/*
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
 */
function uptimeLoadElements( dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/elements';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 [
 {
 "description": "Default uptime check for localhost",
 "elementId": 1,
 "id": 1,
 "isHidden": false,
 "isHostCheck": false,
 "isMonitored": true,
 "name": "UPTIME-localhost",
 "type": "up.time Agent"
 }
 ]
 */
function uptimeLoadMonitors( dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/monitors';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 [
 {
 "description": "",
 "elements": [{
    "id": 1,
    "isMonitored": true,
    "name": "win-dleith"
 }],
 "groupId": null,
 "id": 1,
 "monitors": [{
    "elementId": 1,
    "id": 8,
    "isHidden": false,
    "isMonitored": true,
    "name": "Default Agent Service Check"
 }],
 "name": "My Infrastructure"
 }
 ]
 */
function uptimeLoadGroups( dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/groups';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 {
 "elementStatus": [{
    "id": 2,
    "isMonitored": true,
    "lastCheckTime": "2012-10-03T17:13:18",
    "lastTransitionTime": "2012-09-13T11:34:24",
    "message": "",
    "name": "rd-vc2",
    "powerState": null,
    "status": "OK"
 }],
 "id": 1,
 "monitorStatus": [{
    "elementId": 1,
    "id": 7,
    "isApplicationMasterMonitor": false,
    "isHidden": false,
    "isHostCheck": false,
    "isMonitored": true,
    "lastCheckTime": "2012-10-03T17:11:22",
    "lastTransitionTime": "2012-10-03T17:06:22",
    "message": "",
    "name": "Default File System Capacity",
    "status": "UNKNOWN"
 }],
 "name": "My Infrastructure",
 "topologyParentStatus": []
 }
 */
function uptimeGetGroupStatus( groupId, dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/groups/' + groupId + '/status';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 {
 "id": 1,
 "isMonitored": true,
 "lastCheckTime": "2012-10-03T17:11:22",
 "lastTransitionTime": "2012-09-13T11:34:38",
 "message": "",
 "monitorStatus": [{
    "elementId": 1,
    "id": 7,
    "isApplicationMasterMonitor": false,
    "isHidden": false,
    "isHostCheck": false,
    "isMonitored": true,
    "lastCheckTime": "2012-10-03T17:11:22",
    "lastTransitionTime": "2012-10-03T17:06:22",
    "message": "",
    "name": "Default File System Capacity",
    "status": "UNKNOWN"
 }],
 "name": "win-dleith",
 "powerState": "On",
 "status": "OK",
 "topologyParentStatus": [{
    "id": 2,
    "isMonitored": true,
    "lastCheckTime": "2012-10-03T17:12:18",
    "lastTransitionTime": "2012-09-13T11:34:24",
    "message": "",
    "name": "rd-vc2",
    "powerState": null,
    "status": "OK"
 } ]
 }
 */
function uptimeGetElementStatus( elementId, dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/elements/' + elementId + '/status';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 {
 "elementId": 1,
 "elementStatus": {
    "id": 1,
    "isMonitored": true,
    "lastCheckTime": "2012-10-03T17:11:22",
    "lastTransitionTime": "2012-09-13T11:34:38",
    "message": "",
    "name": "win-dleith",
    "powerState": "On",
    "status": "OK"
 },
 "id": 1,
 "isApplicationMasterMonitor": false,
 "isHidden": false,
 "isHostCheck": false,
 "isMonitored": true,
 "lastCheckTime": "2012-10-03T17:11:28",
 "lastTransitionTime": "2012-10-03T17:11:28",
 "message": "up.time agent running on win-dleith, up.time Windows Agent 6.0.0 (build 69)",
 "name": "UPTIME-localhost",
 "status": "OK"
 }
 */
function uptimeGetMonitorStatus( monitorId, dispFunction ) {
    var load_url = uptime_url_host + uptime_api_ver + '/monitors/' + monitorId + '/status';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

/*
 {
 "databaseHost": "localhost",
 "databaseName": "uptime",
 "databaseVersion": "7.1.0",
 "host": "win-dleith",
 "version": "1"
 }
 */
function uptimeGetAPIInfo( dispFunction ) {
    var load_url = uptime_url_host + '/api';
    $.ajax( {
        url: load_url,
        cache: false,
        username : uptime_user,
        password : uptime_password,
        success: function( data ) {
            // -- we should have a large data array that can be parsed for the list of elements
            dispFunction( data );
        }
    });
}

function uptimeSetAPIInfo( uptimeHost, userid, password ) {
    uptime_url_host = uptimeHost;
    uptime_user = userid;
    uptime_password = password;
}
