gnome-terminal \
--tab -e "bash -c 'cd ~/pox; pox.py forwarding.l2_learning; exec $SHELL'" \
--tab -e "bash -c 'cd ~/pox/ext/panorama; pox.py openflow.of_01 --port=5566 panorama.panorama; exec $SHELL'" \
--tab -e "bash -c 'cd ~/pox/ext/panorama; sudo python topology/panorama_mininet.py; exec $SHELL'"
