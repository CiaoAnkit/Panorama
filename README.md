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
![loading](https://cloud.githubusercontent.com/assets/8746855/20600416/e310c01c-b253-11e6-9940-d84b88f0b126.png)
<br/>

<b>Home Tab<b/>
![home](https://cloud.githubusercontent.com/assets/8746855/20600419/e35a0948-b253-11e6-996f-c8104ed3ac0b.png)
<br/>

<b>N/w Configuration Tab<b/>
![topo](https://cloud.githubusercontent.com/assets/8746855/20600418/e33ee672-b253-11e6-9822-75a11717534c.png)
<br/>

<b>Port Stat Tab<b/>
![port](https://cloud.githubusercontent.com/assets/8746855/20600417/e326bdf4-b253-11e6-9842-e8706870a962.png)
<br/>

<b>Aggregate Stat Tab<b/>
![agg](https://cloud.githubusercontent.com/assets/8746855/20600420/e35a2946-b253-11e6-8561-2ce68485821d.png)
<br/>

<b>Flow Stat Tab<b/>
![flow](https://cloud.githubusercontent.com/assets/8746855/20600422/e35aab00-b253-11e6-88af-828d31e9faad.png)
<br/>

<b>Data Transfer Rate Tab<b/>
![uti](https://cloud.githubusercontent.com/assets/8746855/20600569/96f32df4-b254-11e6-9309-2e5cfc87c0ed.png)

