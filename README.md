#Start geth
geth --datadir ./myDataDir --networkid 1114 --rpccorsdomain '*' --rpc --rpcaddr 'localhost' --rpcapi="db,eth,net,web3,personal" console