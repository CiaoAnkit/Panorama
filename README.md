# Real-time bird's eye view of an OpenFlow Network [SDN-POX]
* Copy the project directory under pox (~/pox/ext/)
* You might need to set path to pox.py [pox directory (~/pox/)] in your PATH variable, you may do it through terminal as:
    $ PATH=$PATH:~/pox/
    $ export PATH

## How to start [Manual]
* Open a new terminal and run a controller module:
    $ cd pox
    $ pox.py forwarding.l2_learning

* Open another terminal and run the monitoring module:
    $ cd [project working directory i.e. ~/pox/ext/panorama]
    $ pox.py openflow.of_01 --port=5566 panorama.panorama

* Open another terminal and start a network:
    $ cd [project working directory i.e. ~/pox/ext/panorama]
    $ sudo python topology/panorama_mininet.py
    *(You may create your own custom topology as well)*

* [If a browser window/tab doesn't come up automatically.] Open a browser window/tab and navigate to:
    http://localhost:8080/

## How to start [Automatic]
* [If you are tired & drowsy !!!] Run the bash script:
    $ cd [project working directory i.e. ~/pox/ext/panorama]
    $ bash launch.sh
