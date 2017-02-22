#!/usr/bin/python

from mininet.net import Mininet
from mininet.node import Controller, RemoteController, OVSKernelSwitch, UserSwitch
from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.link import Link, TCLink
from mininet.util import custom, pmonitor
 
def topology():
    print "*** Creating network."
    net = Mininet( controller=RemoteController, link=TCLink, switch=OVSKernelSwitch )
 
    print "*** Creating nodes"
    h1 = net.addHost( 'h1', mac='00:00:00:00:00:01', ip='10.0.0.1/8' )
    h2 = net.addHost( 'h2', mac='00:00:00:00:00:02', ip='10.0.0.2/8' )
    s3 = net.addSwitch( 's3', listenPort=6673, mac='00:00:00:00:00:03' )
    s4 = net.addSwitch( 's4', listenPort=6674, mac='00:00:00:00:00:04' )

    c10 = net.addController( 'c10', controller=RemoteController, ip='127.0.0.1', port=6633 )
    c11 = net.addController( 'c11', controller=RemoteController, ip='127.0.0.1', port=5566 )
 
    print "*** Creating links"
    net.addLink(s3, h1, cls=TCLink)
    net.addLink(s3, s4, cls=TCLink, bw=1, delay='0ms', loss=0)
    net.addLink(s4, h2, cls=TCLink)
 
    print "*** Starting network"
    net.build()
    c10.start()
    c11.start()
    s3.start( [c10,c11] )
    s4.start( [c10,c11] )
    CLI( net )
 
    print "*** Stopping network"
    net.stop()
  
if __name__ == '__main__':
    setLogLevel( 'info' )
    topology()
