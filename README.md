<h1> Panorama </h1>
Real-time bird's eye view of an OpenFlow Network [SDN-POX]. <br>
[Code coming soon...]
<h3>Usage Manual:<br/></h3>
* Copy the project directory under <b>pox [~/pox/ext/]</b></br>
* You might need to set path to <b>pox.py [pox directory (~/pox/)]</b> in your PATH variable, you may do it through terminal as:<br/>
    <b>$ PATH=$PATH:~/pox/<br/>
    $ export PATH</b>

<h4> How to start [Manual]</h4>
* Open a new terminal and run a controller module:<br/>
    <b>$ cd pox<br/>
    $ pox.py forwarding.l2_learning</b>

* Open another terminal and run the monitoring module:<br/>
    <b>$ cd [project working directory i.e. ~/pox/ext/panorama]<br/>
    $ pox.py openflow.of_01 --port=5566 panorama.panorama</b>

* Open another terminal and start a network:<br/>
    <b>$ cd [project working directory i.e. ~/pox/ext/panorama]<br/>
    $ sudo python topology/panorama_mininet.py<br/></b>
    *(You may create your own custom topology as well.)*

* [If a browser window/tab doesn't come up automatically.]<br/>
Open a browser window/tab and navigate to:<br/>
    <b>http://localhost:8080/</b>

<h4> How to start [Automatic]<br/></h4>
* [If you are tired & drowsy !!!] Run the bash script:<br/>
   <b>$ cd [project working directory i.e. ~/pox/ext/panorama]<br/>
    $ bash launch.sh</b>

<h3>Screenshots</h3>

<b>Loading<b/>
![loading](https://cloud.githubusercontent.com/assets/8746855/14858125/77c09b44-0cbc-11e6-9f77-3f83bd81c7c5.png)
<br/>

<b>Home Tab<b/>
![home](https://cloud.githubusercontent.com/assets/8746855/14858129/7b7d7a72-0cbc-11e6-94f2-237b6145315a.png)
<br/>

<b>N/w Configuration Tab<b/>
![topo](https://cloud.githubusercontent.com/assets/8746855/14858644/7558e238-0cbe-11e6-93a4-e111dda4e64c.png)
<br/>

<b>Port Stat Tab<b/>
![port](https://cloud.githubusercontent.com/assets/8746855/14858142/83137336-0cbc-11e6-8416-abc1976ab852.png)
<br/>

<b>Aggregate Stat Tab<b/>
![agg](https://cloud.githubusercontent.com/assets/8746855/14858153/8b9390d6-0cbc-11e6-9fc4-44890661a2f9.png)
<br/>

<b>Flow Stat Tab<b/>
![flow](https://cloud.githubusercontent.com/assets/8746855/14858155/8d30a00a-0cbc-11e6-8c3c-d652b18d1819.png)
<br/>

<b>Link Throughput Tab<b/>
![uti](https://cloud.githubusercontent.com/assets/8746855/14858162/94ea0af2-0cbc-11e6-88e3-d0ca232d22ed.png)

