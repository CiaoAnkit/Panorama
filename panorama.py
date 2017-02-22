from pox.core import core
from pox.lib.revent import *
from pox.openflow.of_json import *
from pox.lib.recoco import Timer
from pox.lib.util import dpidToStr
import pox.openflow.libopenflow_01 as of
from pox.lib.addresses import IPAddr, EthAddr
from pox.lib.packet.ipv4 import IP_ANY, IP_BROADCAST
from pox.lib.packet.ethernet import ETHER_ANY, ETHER_BROADCAST
from pox.openflow.discovery import Discovery
import BaseHTTPServer
from SocketServer import ThreadingMixIn
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import re
import cgi
import json
import time
import thread
import argparse
import threading
import webbrowser
from os import curdir, sep
from collections import defaultdict

log = core.getLogger()

switches = []
hosts = defaultdict(lambda:defaultdict(lambda:None))
switch_desc = defaultdict(lambda:defaultdict(lambda:None))
adjacency = defaultdict(lambda:defaultdict(lambda:None))
link_bw = defaultdict(lambda:defaultdict(lambda:None))
link_bw_total = defaultdict(lambda:defaultdict(lambda:None))
byte = defaultdict(lambda:defaultdict(lambda:None))
byte_r = defaultdict(lambda:defaultdict(lambda:None))
clock = defaultdict(lambda:defaultdict(lambda:None))
flow_stats = defaultdict(lambda:None)
aggr_stats = defaultdict(lambda:None)
port_stats = defaultdict(lambda:None)
FILE = 'index.html'
PORT = 8080


class HTTPRequestHandler(BaseHTTPRequestHandler):
 
  def do_POST(self):
    return

  def do_GET(self):
    global flow_stats, port_stats, hosts, switch_desc, aggr_stats
    if self.path=='/':
      self.path='/index.html'
    try:
      sendReply = False
      success = False
      if self.path.endswith('.html'):
        mimetype='text/html'
        sendReply = True
      if self.path.endswith('.png'):
        mimetype='image/png'
        sendReply = True
      if self.path.endswith('.js'):
        mimetype='application/javascript'
        sendReply = True
      if self.path.endswith('.css'):
        mimetype='text/css'
        sendReply = True
      if self.path.endswith('.ttf'):
        mimetype='application/ttf'
        sendReply = True
      if self.path.endswith('.woff'):
        mimetype='application/woff'
        sendReply = True
      if self.path.endswith('.woff2'):
        mimetype='application/woff2'
        sendReply = True
      if self.path.endswith('.ico'):
        mimetype='text/html'
        sendReply = True

      if sendReply == True:
        f = open(curdir + sep + self.path) 
        self.send_response(200)
        self.send_header('Content-type',mimetype)
        self.end_headers()
        self.wfile.write(f.read())
        f.close()
        success = True

      else:
        if None != re.search('/switch_info/*', self.path):
          #print 'Switch Info ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(switch_desc, sort_keys=True))
          success = True

        if None != re.search('/host_info/*', self.path):
          #print 'Host Info ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(hosts, sort_keys=True))
          success = True

        if None != re.search('/topo_info/*', self.path):
          #print 'Topo Info ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
	  def transform_key(d):
	    newd = dict()
	    for k,v in d.iteritems():
	      if isinstance(v, dict):
		v = transform_key(v)
	      newd[dpidToStr(k)] = v
	    return newd
	  def stripNone(xdata):
	    if isinstance(xdata, dict):
              return {k:stripNone(v) for k, v in xdata.items() if k is not None and v is not None}
	    else:
              return xdata
	  adj_raw = transform_key(adjacency)	   # dpidToStr.
 	  adj_raw_tmp = stripNone(adj_raw)	   # Remove self links.
          self.wfile.write(json.dumps(adj_raw_tmp, sort_keys=True))
          success = True
        if None != re.search('/port_stats/*', self.path):
          #print 'Port Stats ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(port_stats, sort_keys=True))
          success = True

        if None != re.search('/aggr_stats/*', self.path):
          #print 'Aggregate Stats ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(aggr_stats, sort_keys=True))
          success = True


        if None != re.search('/flow_stats/*', self.path):
          #print 'Flow Stats ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
	  def process_fs(flow_stats):
	    for i in flow_stats:
	      for f in flow_stats[i]:
	        ix = 'match'
	        jx = 'nw_src'
	        if jx in f[ix]:
	          ip = f[ix][jx]
	          f[ix][jx] = str(ip)
	        jx = 'nw_dst'
	        if jx in f[ix]:
	          ip = f[ix][jx]
	          f[ix][jx] = str(ip)
	    return flow_stats
	  processed_fs = process_fs(flow_stats)
          self.wfile.write(json.dumps(processed_fs, ensure_ascii=False, sort_keys=True))
          success = True
        if None != re.search('/bw/*', self.path):
          #print 'Throughput ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(link_bw, sort_keys=True))
          success = True
        if None != re.search('/bandwidth/*', self.path):
          #print 'Throughput Bidectional ...'
          self.send_response(200)
          self.send_header('Content-Type', 'application/json')
          self.end_headers()
          self.wfile.write(json.dumps(link_bw_total, sort_keys=True))
          success = True

      if success == False:
        print 'Error'
        self.send_response(403)
        self.end_headers()
    except IOError:
        self.send_error(404,'File Not Found: %s' % self.path)
    return

 
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
  allow_reuse_address = True
 
  def shutdown(self):
    self.socket.close()
    HTTPServer.shutdown(self)
 
class SimpleHttpServer():
  def __init__(self, ip, port):
    self.server = ThreadedHTTPServer((ip,port), HTTPRequestHandler)
 
  def start(self):
    self.server_thread = threading.Thread(target=self.server.serve_forever)
    self.server_thread.daemon = True
    self.server_thread.start()
 
  def waitForThread(self):
    self.server_thread.join()
 
  def stop(self):
    self.server.shutdown()
    self.waitForThread()

def _timer_func ():
  if len(core.openflow._connections.values())==0:
    # since no switch is connected, clean everything.
    del switches[:]
    hosts.clear()
    switch_desc.clear()
    adjacency.clear()
    link_bw.clear()
    link_bw_total.clear()
    byte.clear()
    byte_r.clear()
    clock.clear()
    flow_stats.clear()
    aggr_stats.clear()
    port_stats.clear()
  for connection in core.openflow._connections.values():
    connection.send(of.ofp_stats_request(body=of.ofp_port_stats_request()))
    connection.send(of.ofp_stats_request(body=of.ofp_aggregate_stats_request()))
    connection.send(of.ofp_stats_request(body=of.ofp_flow_stats_request()))
    connection.send(of.ofp_stats_request(body=of.ofp_desc_stats_request()))

def _handle_portstats_received (event):
  global port_stats
  port_stats[dpidToStr(event.connection.dpid)] = flow_stats_to_list(event.stats)
  for f in event.stats:
    if int(f.port_no)<65534:
      for p in switches:
        if adjacency[event.connection.dpid][p]!=None and adjacency[event.connection.dpid][p]==f.port_no:
          if byte[dpidToStr(event.connection.dpid)][dpidToStr(p)]>0:  
            link_bw[dpidToStr(event.connection.dpid)][dpidToStr(p)] = format((f.tx_bytes - byte[dpidToStr(event.connection.dpid)][dpidToStr(p)]) * 8.0 / (time.time()-clock[dpidToStr(event.connection.dpid)][dpidToStr(p)]),'.2f')
            link_bw_total[dpidToStr(event.connection.dpid)][dpidToStr(p)] = format((f.tx_bytes + f.rx_bytes - byte[dpidToStr(event.connection.dpid)][dpidToStr(p)]- byte_r[dpidToStr(event.connection.dpid)][dpidToStr(p)]) * 8.0 / (time.time()-clock[dpidToStr(event.connection.dpid)][dpidToStr(p)]),'.2f')

          byte[dpidToStr(event.connection.dpid)][dpidToStr(p)] = f.tx_bytes
          byte_r[dpidToStr(event.connection.dpid)][dpidToStr(p)] = f.rx_bytes
          clock[dpidToStr(event.connection.dpid)][dpidToStr(p)] = time.time()
        if adjacency[event.connection.dpid][p]==None:
	  link_bw[dpidToStr(event.connection.dpid)][dpidToStr(p)] = 'N/A'		#since no data transmits from a switch to itself
	  link_bw_total[dpidToStr(event.connection.dpid)][dpidToStr(p)] = 'N/A'

def _handle_aggregate_flowstats_received (event):
  global aggr_stats
  aggr_stats[dpidToStr(event.connection.dpid)] =  [event.stats.__dict__]

def _handle_flowstats_received (event):
  global flow_stats
  flow_stats[dpidToStr(event.connection.dpid)] = flow_stats_to_list(event.stats)

def _handle_switchdesc_received (event):
  global switch_desc
  event.connection.dpid
  switch_desc[dpidToStr(event.connection.dpid)]['hw_desc'] = event.stats.hw_desc
  switch_desc[dpidToStr(event.connection.dpid)]['sw_desc'] = event.stats.sw_desc
  switch_desc[dpidToStr(event.connection.dpid)]['mfr_desc'] = event.stats.mfr_desc
  switch_desc[dpidToStr(event.connection.dpid)]['serial_num'] = event.stats.serial_num

def _handle_ConnectionUp (event):
  switches.append(event.connection.dpid)

def _handle_ConnectionDown (event):
  sw = event.connection.dpid
  for i in switches:
      if sw in adjacency[i]: del adjacency[i][sw]
      if dpidToStr(sw) in link_bw[dpidToStr(i)]: del link_bw[dpidToStr(i)][dpidToStr(sw)]
      if dpidToStr(sw) in link_bw_total[dpidToStr(i)]: del link_bw_total[dpidToStr(i)][dpidToStr(sw)]

      expired_hosts = []
      for i in hosts:			# remove associated hosts 
	 if hosts[i]['switch'] == dpidToStr(sw):
           expired_hosts.append(i)
      for i in expired_hosts:
        del hosts[i]

  switches.remove(sw)
  del adjacency[sw]
  del link_bw[dpidToStr(sw)]
  del link_bw_total[dpidToStr(sw)]
  del flow_stats[dpidToStr(sw)]
  del aggr_stats[dpidToStr(sw)]
  del port_stats[dpidToStr(sw)]
  del switch_desc[dpidToStr(sw)]

class panorama (EventMixin):
  global hosts
  def __init__ (self):
    def startup ():
      self.HOST_TIMEOUT = 15		# time (in seconds) to perform cleanup, generally it should be greater than expected HARD_TIMEOUTs
      Timer(self.HOST_TIMEOUT, self.host_refresh, recurring=True)
      core.openflow.addListeners(self, priority=0)
      core.openflow_discovery.addListeners(self)
    core.call_when_ready(startup, ('openflow','openflow_discovery'))

  def host_refresh(self):
    expired_hosts = []
    for i in hosts:
      if int(time.time()) - hosts[i]['last_time_seen'] > self.HOST_TIMEOUT:
        expired_hosts.append(i)
    for i in expired_hosts:
      del hosts[i]

  def _handle_PacketIn (self, event):
    eth_packet = event.parsed
    in_port = event.port
    # assuming that switches do not have any forwarding rule pre-installed
    # so the first packet from a host will travel to controller
    # it is a rough logic to discover host, it can be improved

    if not eth_packet.parsed:
      return
    src_mac = eth_packet.src
    if eth_packet.type == ethernet.ARP_TYPE:
      arp_packet = eth_packet.payload
      if not arp_packet.hwsrc == src_mac:
        return
      src_ip = arp_packet.protosrc
      if src_ip == IP_ANY: 
        return
    elif eth_packet.type == ethernet.IP_TYPE:
      ip_packet = eth_packet.payload
      src_ip = ip_packet.srcip
      if src_ip == IP_ANY: 
        return
    else: 
      return
    if not hosts[str(src_ip)]:
      hosts[str(src_ip)]['mac'] = str(src_mac)
      hosts[str(src_ip)]['switch'] = dpidToStr(event.connection.dpid)
      hosts[str(src_ip)]['last_time_seen'] = int(time.time())
      hosts[str(src_ip)]['in_port'] = in_port

  def _handle_LinkEvent (self, event):
    def flip (link):
      return Discovery.Link(link[2],link[3], link[0],link[1])
    l = event.link
    sw1 = l.dpid1
    sw2 = l.dpid2

    if event.removed:
      if sw2 in adjacency[sw1]: del adjacency[sw1][sw2]
      if sw1 in adjacency[sw2]: del adjacency[sw2][sw1] 
    else:
      if adjacency[sw1][sw2] is None:
        if flip(l) in core.openflow_discovery.adjacency:
          adjacency[sw1][sw2] = l.port1
          adjacency[sw2][sw1] = l.port2
 
def launch ():
  def server_launch():
    webbrowser.open('http://localhost:%s/%s' % (PORT, FILE))
    server = SimpleHttpServer('127.0.0.1', int(PORT))
    print 'HTTP Server Running...........'
    server.start()
    server.waitForThread()
  
  thread.start_new(server_launch, ())
  from pox.log.level import launch
  launch(CRITICAL=True)
  from openflow.discovery import launch
  launch()
  from openflow.spanning_tree import launch
  launch('--no-flood --hold-down')
  core.registerNew(panorama)
  core.openflow.addListenerByName('ConnectionUp', _handle_ConnectionUp)
  core.openflow.addListenerByName('ConnectionDown', _handle_ConnectionDown)
  core.openflow.addListenerByName('PortStatsReceived', _handle_portstats_received)
  core.openflow.addListenerByName('AggregateFlowStatsReceived', _handle_aggregate_flowstats_received)
  core.openflow.addListenerByName('FlowStatsReceived', _handle_flowstats_received)
  core.openflow.addListenerByName('SwitchDescReceived', _handle_switchdesc_received)
  Timer(1, _timer_func, recurring=True)
