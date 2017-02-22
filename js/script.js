(function(){
	var adj_chk = {};
	var host_chk = {};
	var switch_desc = {};
    $(document).ready(function(){	
	var timerId = 0;
	var ctr=0;
	var max=100;  
	timerId = setInterval(function (){
	ctr += 1 ;
	$('#blips > .progress-bar').attr("style","width:" + ctr + "%");
	if (ctr==max){
	clearInterval(timerId);
	}    
	$('#progress-div').empty();
	$('#progress-div').append(ctr + '%');
	},50);

	$.blockUI({ css:{ 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: 1, 
            color: '#fff' 
        }, message: $('#blips')}); 	
	setTimeout($.unblockUI, 6000);			// blocks UI untill data is ready.
	$('#loading').remove();

        $('#myTabs a').click(function (e) {
            e.preventDefault();
            $('#myTabs a').tab('hide');
            $(this).tab('show');
        });

	$('[data-toggle="tooltip"]').tooltip();  	// tooltip handlers.
	$("body").tooltip({ selector: '[data-toggle="tooltip"]' }); 

	var timerTopo = 0;
	var timer_refersh = 1000; 			// refresh data every n milisecods.

	$(document).on('click','#pause',function(){	
	if($('#pause').hasClass('glyphicon-refresh')){
		$('#pause').removeClass('glyphicon-refresh  glyphicon-refresh-animate');
		$('#pause').addClass('glyphicon-off');
		clearInterval(timerTopo);
	}
	else{
		$('#pause').removeClass('glyphicon-off');
		$('#pause').addClass('glyphicon-refresh glyphicon-refresh-animate');
	        timerTopo = setInterval(function(){refreshView();}, timer_refersh);

	}});
        timerTopo = setInterval(function() {refreshView();}, timer_refersh);
    });


// call every function

    function refreshView() {
    	getTopoInfo().then(function(data){
	    //var jsonData = eval(data);
	    var jsonData = JSON.parse(data);
	    UpdateSwitchInfoView(jsonData);
	    UpdateTopoView(jsonData);
	getHostInfo().then(function(data){
	  jsonData_h = JSON.parse(data);
	  UpdateTopology(jsonData, jsonData_h);
	  UpdateHostInfo(jsonData_h);
	}).fail(function (jqXHR, textStatus, errorThrown) {
	    console.log("HostInfo Failed !!!");
	});
	}).fail(function (jqXHR, textStatus, errorThrown) {
	    console.log("TopoInfo Failed !!!");
	});

    
        getPortStats().then(function(data){
            //var jsonData = eval(data);
            var jsonData = JSON.parse(data);
            UpdatePortStatsView(jsonData);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("PortStats Failed !!!");
        });

        getAggrStats().then(function(data){
            //var jsonData = eval(data);
            var jsonData = JSON.parse(data);
            UpdateAggrStatsView(jsonData);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("AggrStats Failed !!!");
        });

        
        getFlowStats().then(function(data){
            //var jsonData = eval(data);
            var jsonData = JSON.parse(data);
            UpdateFlowStatsView(jsonData);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("FlowStats Failed !!!");
        });


	getBW().then(function(data){
	    //var jsonData = eval(data);
	    var jsonData = JSON.parse(data);
	    UpdateBW(jsonData);
	}).fail(function (jqXHR, textStatus, errorThrown) {
	    console.log("BW Failed !!!");
	});

	getBW_bi().then(function(data){
	    //var jsonData = eval(data);
	    var jsonData = JSON.parse(data);
	    UpdateBW_bi(jsonData);
	}).fail(function (jqXHR, textStatus, errorThrown) {
	    console.log("BW_bi Failed !!!");
	});
}

    function UpdateSwitchInfoView(data) {
        $('#tab1Table tbody tr').remove();
	var td = "";
	var switch_data = "";
	td = '<th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of connected switches." class="badge">' + Object.keys(data).length + '</span></div>Switches</div><table id = "sw_table" class="table table-hover">';
	td += '<tr><th>DPID</th></tr>';
	var tr = '<tr>' + td + '</tr>';
	$('#tab1Table tbody').append(tr);
	td = "";
	for (var i in data){
		td += '<td>' + i + '</td> </tr> <tr>'
		}td += '</tr>'
            tr = '<tr>' + td + '</tr>';
            $('#sw_table tbody').append(tr);
	var end = '</table></div></th></tr>';
            $('#tab1Table tbody').append(end);
}


    function UpdateTopoView(data) {
        $('#tab1Table1 tbody tr').remove();
	var td = "";
	var newadj = [];
	for (var i in data){
	    for (var j in data[i]){
		var x  = [i, j];
		newadj.push(x);
			}
		}
	var length = newadj.length;
	for (var key1 in newadj) {
	    var src = newadj[key1][0];
	    var dst = newadj[key1][1];
	for (var key2 in newadj){
	if (newadj[key2][0]== dst && newadj[key2][1]== src){
	delete newadj[key2];
			}
		}
	}

	td = '<th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of links among switches." class="badge">' + length/2 + '</span></div>Links</div><table id = "topo_view_table" class="table table-hover">';
	td += '<th>DPID (Port #)</th><th>DPID (Port #)</th></tr>';
	var tr = '<tr>' + td + '</tr>';
	$('#tab1Table1 tbody').append(tr);
	td = "";
	for (var i in newadj){
	td += '<tr><td>' + newadj[i][0] + ' (' + data[newadj[i][0]][newadj[i][1]] + ') </td><td>' + newadj[i][1] + ' (' + data[newadj[i][1]][newadj[i][0]] + ') </td></tr><tr>';
	}
	tr = '<tr>' + td + '</tr>';
	$('#topo_view_table tbody').append(tr);
	var end = '</table></div></th></tr>';
	$('#tab1Table1 tbody').append(end);	

}

    function UpdateHostInfo(data) {
        $('#tab1Table2 tbody tr').remove();
	var td = "";
	var host_data = "";
	td = '<th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of connected hosts." class="badge">' + Object.keys(data).length + '</span></div>Hosts</div><table id = "hst_table" class="table table-hover">';
	td += '<tr><th style="width: 33%;">IP Address</th><th style="width: 33%;">MAC Address</th><th style="width: 33%;">Connected To (Port #)</th></tr>';
	var tr = '<tr>' + td + '</tr>';
	$('#tab1Table2 tbody').append(tr);
	td = "";
	for (var i in data){
		td += '<tr><td>' + i + '</td><td>' + data[i]["mac"] +'</td><td>' + data[i]["switch"] +' (' + data[i]["in_port"] +')</td></tr>'
		}
            $('#hst_table tbody').append(td);
	var end = '</table></div></th></tr>';
            $('#tab1Table2 tbody').append(end);

}

    function UpdateTopology(data, host_data) {
	//update only when a change is detected in data.
	function objectEquals(x, y) {
	    'use strict';
	    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
	    if (x.constructor !== y.constructor) { return false; }
	    if (x instanceof Function) { return x === y; }
	    if (x instanceof RegExp) { return x === y; }
	    if (x === y || x.valueOf() === y.valueOf()) { return true; }
	    if (Array.isArray(x) && x.length !== y.length) { return false; }
	    if (x instanceof Date) { return false; }
	    if (!(x instanceof Object)) { return false; }
	    if (!(y instanceof Object)) { return false; }
	    var p = Object.keys(x);
	    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
		p.every(function (i) { return objectEquals(x[i], y[i]); });
	}

        if(!(objectEquals(adj_chk, data)) || !(objectEquals(host_chk, host_data)) ){
		adj_chk = data;
		host_chk = host_data;
		var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		$('#tab1Table3 tbody tr').remove();
		var td = "";
		td = '<th><div class="panel panel-primary"><div class="panel-heading">Topology <i data-toggle="tooltip" title="Drag or zoom-in/out to adjust." class="glyphicon glyphicon-info-sign" style="vertical-align:middle;"></i></div><table id = "topology_table" class="table"><tr><td><center><div id="mynetwork" style=" border: 1px; border-color: #337ab7;"></div></center></td>';
		var tr = '<tr>' + td + '</tr>';
		$('#tab1Table3 tbody').append(tr);  
		var newadj = [];
		var node = [];
		var edge = [];
		var nodex = {};				//to trace a unique list of nodes
		var DIR = '../img/';			// can be used for icons

		getSwitchInfo().then(function(data){	// get switch description
		    //var jsonData = eval(data);
		    switch_desc = JSON.parse(data);	
		}).fail(function (jqXHR, textStatus, errorThrown) {
		    console.log("SwitchInfo Failed !!!");
		});

		for (var i in data){
		    var topo_data = data[i];
			if(!( nodex[i] )){
			    nodex[i] = true;
			    node.push({id: i, label: i,  title: 'Switch #' + Object.keys(nodex).length +
			    '<hr> Serial #: ' + switch_desc[i]['serial_num'] +
			    ' <br> S/w Version: ' + switch_desc[i]['sw_desc'] +
			    ' <br> Vendor: ' + switch_desc[i]['mfr_desc'] +   
			    ' <br> H/w Type: ' + switch_desc[i]['hw_desc'] + 
			    ' <br> DPID: ' + i, image: DIR + 'switch.png', shape: 'image'});} 		// used for icons
			    //node.push({id: i, label: i, title: 'Switch #' + Object.keys(nodex).length +
			    //'<hr> Serial #: ' + switch_desc[i]['serial_num'] +
			    //' <br> S/w Version: ' + switch_desc[i]['sw_desc'] +
			    //' <br> Vendor: ' + switch_desc[i]['mfr_desc'] +   
			    //' <br> H/w Type: ' + switch_desc[i]['hw_desc'] + 
			    //' <br> DPID: ' + i, shape: 'box', color: '#00BFFF', shadow:true});}	// add nodes for switch

			for (var j in topo_data){
				var x  = [i, j];
				newadj.push(x);
				}
			}
		for (var key1 in newadj) {		//since links are bidirectional, we need to draw either link(A,B) or link(B,A)
		    var src = newadj[key1][0];
		    var dst = newadj[key1][1];
		for (var key2 in newadj){
		if (newadj[key2][0]== dst && newadj[key2][1]== src){
		delete newadj[key2];
					}
				}
			}
		for (var i in newadj){
			//edge.push({from: newadj[i][0], to: newadj[i][1], shadow:true, label: '< ' + data[newadj[i][0]][newadj[i][1]] + ' : Port : ' + data[newadj[i][1]][newadj[i][0]] + ' >', font: {align: 'top'}});}		//add edges among switches
			edge.push({from: newadj[i][0], to: newadj[i][1], shadow:true,  title: 'Link<hr>' + newadj[i][0] + ' (' + data[newadj[i][0]][newadj[i][1]] + ') &  ' + newadj[i][1] + ' (' + data[newadj[i][1]][newadj[i][0]] + ')'});}		//add edges among switches
		var tmp = Object.keys(host_data).length;


		for (var i in host_data){
			if (host_data[i]["switch"] in nodex){
				var date = new Date(host_data[i]["last_time_seen"] * 1000);
				var time_seen = (monthName[date.getMonth()]) + " " + date.getDate() + ", " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
				var id_tmp = Object.keys(host_data).length - tmp + 1;
				node.push({id: i, label: i, title: 'Host #' + id_tmp + '<hr>IP: ' + i + '<br>MAC: ' + host_data[i]["mac"] + '<br>Last Seen: ' + time_seen, image: DIR + 'host.png', shape: 'image'});		// add nodes for hosts
				//node.push({id: i, label: i, title: 'Host #' + id_tmp + '<hr>IP: ' + i + '<br>MAC: ' + host_data[i]["mac"] + '<br>Last Seen: ' + time_seen, shape: 'circle', color:'#FE2E64', shadow:true});		// add nodes for hosts
				tmp --;
				edge.push({from: i, to: host_data[i]["switch"], shadow:true, title: 'Link<hr>' + host_data[i]["mac"] + ' (0)  &  ' + host_data[i]["switch"] + ' (' + host_data[i]["in_port"] + ')'});	// add edges between hosts and switches
			}					

		}

		var data_nw = {nodes: node, edges: edge}; 	
		var container = document.getElementById('mynetwork');
		var options = {
		  "edges": {
		    //"smooth": {"forceDirection": "vertical"}
		    "smooth": false
		  },
		  "physics": {"barnesHut": {
				"centralGravity": 0.2,
				"gravitationalConstant":-4000,
				"springLength": 150,
				//"springConstant": 0.5,
				"avoidOverlap": 0.5,
				"damping": 0.1
			    },
				//"minVelocity": 1,
				//"maxVelocity": 50,
				"stabilization": false
			  },
			"interaction":{"hover":true},
		  "autoResize": true,
          	  "height": "600px",
	          "width": "100%"
			};
		var network = new vis.Network(container, data_nw, options);
	}
		var end = '</table></div></th></tr>';
		    $('#tab1Table3 tbody').append(end);
}

    function UpdatePortStatsView(data) {
        $('#tab2Table tbody tr').remove();
	var td = "";	
	for (var i in data){
            td += '<tr><th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of entries." class="badge">' + Object.keys(data[i]).length + '</span></div>' + i + '</div><table id = "ps' + i + '" class="table table-hover"><tbody></tbody></table></div></th></tr>';
		}
            $('#tab2Table tbody').append(td);
	var value = "";
	for (i in data){	
		td = "";
		value = data[i];
		td += '<tr><th>port_no</th>'
		td += '<th>tx_packets</th>'
		td += '<th>tx_bytes</th>'
		td += '<th>tx_errors</th>'
		td += '<th>tx_dropped</th>'
		td += '<th>collisions</th>'
		td += '<th>rx_packets</th>'
		td += '<th>rx_bytes</th>'
		td += '<th>rx_errors</th>'
		td += '<th>rx_dropped</th>'
		td += '<th>rx_over_err</th>'
		td += '<th>rx_frame_err</th>'
		td += '<th>rx_crc_err</th></tr>'
		for (j in value){
			td += '<tr><td>' + value[j]['port_no'] + '</td>'
			td += '<td>' + value[j]['tx_packets'] + '</td>'
			td += '<td>' + value[j]['tx_bytes'] + '</td>'
			td += '<td>' + value[j]['tx_errors'] + '</td>'
			td += '<td>' + value[j]['tx_dropped'] + '</td>'
			td += '<td>' + value[j]['collisions'] + '</td>'
			td += '<td>' + value[j]['rx_packets'] + '</td>'
			td += '<td>' + value[j]['rx_bytes'] + '</td>'
			td += '<td>' + value[j]['rx_errors'] + '</td>'
			td += '<td>' + value[j]['rx_dropped'] + '</td>'
			td += '<td>' + value[j]['rx_over_err'] + '</td>'
			td += '<td>' + value[j]['rx_frame_err'] + '</td>'
			td += '<td>' + value[j]['rx_crc_err'] + '</td></tr>'
			}
			$('#ps'+ i +' tbody').append(td);
		}
}
    



    function UpdateAggrStatsView(data) {
        $('#tab3Table tbody tr').remove();
	var td = "";	
	for (var i in data){
            td += '<tr><th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of entries." class="badge">' + Object.keys(data[i]).length + '</span></div>' + i + '</div><table id = "as' + i + '" class="table table-hover"><tbody></tbody></table></div></th></tr>';
		}
            $('#tab3Table tbody').append(td);
	var value = "";
	for (i in data){	
		td = "";
		value = data[i];
		td += '<tr><th>flow_count</th>'
		td += '<th>packet_count</th>'
		td += '<th>byte_count</th></tr>'
		for (j in value){
			td += '<tr><td>' + value[j]['flow_count'] + '</td>'
			td += '<td>' + value[j]['packet_count'] + '</td>'
			td += '<td>' + value[j]['byte_count'] + '</td></tr>'
			}
			$('#as'+ i +' tbody').append(td);
		}
}
    


    function UpdateFlowStatsView(data) {
        $('#tab4Table tbody tr').remove();
	var td = "";	
	for (var i in data){
            td += '<tr><th><div class="panel panel-primary"><div class="panel-heading"><div class="pull-left"><span data-toggle="tooltip" data-placement="right" title="No. of entries." class="badge">' + Object.keys(data[i]).length + '</span></div>' + i + '</div><table id = "fs' + i + '" class="table table-hover"><tbody></tbody></table></div></th></tr>';
		}
            $('#tab4Table tbody').append(td);
	for (i in data){
		td = "";
		var value = data[i];
		td += '<tr><th colspan="11">match</th>'
		td += '<th rowspan="2">actions</th>'
		td += '<th rowspan="2">priority</th>'
		td += '<th colspan="2">timeout</th>'
		td += '<th colspan="2">duration</th>'
		td += '<th colspan="2">count</th>'
		td += '<th rowspan="2">table_id</th>'
		td += '<th rowspan="2">cookie</th></tr>'
		td += '<tr><td>dl_src</td>'
		td += '<td>dl_dst</td>'
		td += '<td>dl_type</td>'
		td += '<td>dl_vlan</td>'
		td += '<td>nw_src</td>'
		td += '<td>nw_dst</td>'
		td += '<td>nw_proto</td>'
		td += '<td>nw_tos</td>'
		td += '<td>tp_src</td>'
		td += '<td>tp_dst</td>'
		td += '<td>in_port</td>'
		td += '<td>idle_timeout</td>'
		td += '<td>hard_timeout</td>'
		td += '<td>duration_sec</td>'
		td += '<td>duration_nsec</td>'
		td += '<td>packet_count</td>'
		td += '<td>byte_count</td></tr>'
		for (j in value){
			var match_raw = "";
			var data_act = value[j]['match'];
				if(data_act.hasOwnProperty('dl_src'))
					match_raw += '<td>' + data_act['dl_src'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('dl_dst'))
					match_raw += '<td>' + data_act['dl_dst'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('dl_type'))
					match_raw += '<td>' + data_act['dl_type'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('dl_vlan'))
					match_raw += '<td>' + data_act['dl_vlan'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('nw_src'))
					match_raw += '<td>' + data_act['nw_src'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('nw_dst'))
					match_raw += '<td>' + data_act['nw_dst'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('nw_proto'))
					match_raw += '<td>' + data_act['nw_proto'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('nw_tos'))
					match_raw += '<td>' + data_act['nw_tos'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('tp_src'))
					match_raw += '<td>' + data_act['tp_src'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('tp_dst'))
					match_raw += '<td>' + data_act['tp_dst'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'

				if(data_act.hasOwnProperty('in_port'))
					match_raw += '<td>' + data_act['in_port'] + '</td>'
				else
					match_raw += '<td>' + '*' +' </td>'
			td += match_raw
			var action_raw = "";
			var action_data = value[j]['actions'];
			for (ix in action_data){
				data_act = action_data[ix];
				for (jx in data_act){
				action_raw += jx + ' : '+ data_act[jx] + '<br>';
				}action_raw += '<hr>';}
			td += '<td class = "left_d">' + action_raw + '</td>'
			td += '<td>' + value[j]['priority'] + '</td>'
			td += '<td>' + value[j]['idle_timeout'] + '</td>'
			td += '<td>' + value[j]['hard_timeout'] + '</td>'
			td += '<td>' + value[j]['duration_sec'] + '</td>'
			td += '<td>' + value[j]['duration_nsec'].toExponential() + '</td>'
			td += '<td>' + value[j]['packet_count'] + '</td>'
			td += '<td>' + value[j]['byte_count'] + '</td>'
			td += '<td>' + value[j]['table_id'] + '</td>'
			td += '<td>' + value[j]['cookie'] + '</td></tr>'
			}
			$('#fs'+ i +' tbody').append(td);
		}
}

    function UpdateBW(data) {
        $('#tab5Table tbody tr').remove();
	var td = '<th><div class="panel panel-primary"><div class="panel-heading">Uni-Directional (bps)</div><table id = "uni_table" class="table table-hover"><tr><th>Switch</th>';
	for (var i in data){
            td += '<th>' + i + '</th>'
		}
            var tr = '<tr>' + td + '</tr>';
            $('#tab5Table tbody').append(tr);
	td = "";
	var bw_data = "";
	for (var i in data){
            td += '<td><b>' + i + '</b></td>'
	    bw_data = data[i];
	for (var j in bw_data){ 
            td += '<td>' + bw_data[j] + '</td>'
	}   td +=  '</tr><tr>'}
            tr = '<tr>' + td + '</tr>';
            $('#uni_table tbody').append(tr);
	    var end = '</table></div></th></tr>';
            $('#tab5Table tbody').append(end);
}

    function UpdateBW_bi(data) {
        $('#tab5Table1 tbody tr').remove();
	var td = '<th><div class="panel panel-primary"><div class="panel-heading">Bi-Directional (bps)</div><table id = "bi_table" class="table table-hover"><tr><th>Switch</th>';
	for (var i in data){
            td += '<th>' + i + '</th>'
		}
            var tr = '<tr>' + td + '</tr>';
            $('#tab5Table1 tbody').append(tr);
	td = "";
	var bw_data = "";
	for (var i in data){
            td += '<td><b>' + i + '</b></td>'
	    bw_data = data[i];
	for (var j in bw_data){ 
            td += '<td>' + bw_data[j] + '</td>'
	}   td +=  '</tr><tr>'}
            tr = '<tr>' + td + '</tr>';
            $('#bi_table tbody').append(tr);
	    var end = '</table></div></th></tr>';
            $('#tab5Table1 tbody').append(end);
}


// Fetch data from url(s)

    function getHostInfo() {
        return $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/host_info/',
            dataType: 'text'
        });
}


    function getSwitchInfo() {
        return $.ajax({
	    async:false,
            method: 'GET',
            url: 'http://localhost:8080/switch_info/',
            dataType: 'text'
        });
}


    function getTopoInfo() {
        return $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/topo_info/',
            dataType: 'text'
        });
}

    function getPortStats() {
        return $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/port_stats/',
            dataType: 'text'
        });
}
    

    function getAggrStats() {
        return $.ajax({

            method: 'GET',
            url: 'http://localhost:8080/aggr_stats/',
            dataType: 'text'
        });
}


    function getFlowStats() {
        return $.ajax({

            method: 'GET',
            url: 'http://localhost:8080/flow_stats/',
            dataType: 'text'
        });
}

    function getBW() {
        return $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/bw/',
            dataType: 'text'
        });
}

    function getBW_bi() {
        return $.ajax({
            method: 'GET',
            url: 'http://localhost:8080/bandwidth/',
            dataType: 'text'
        });
}
    
})();
