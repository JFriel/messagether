import React, { Component } from 'react';
import './App.css';
import { config} from './config.js';
import MessageInput from './components/messageInput';

const Web3 = require('web3');
const Web3Utils = require('web3-utils');
class App extends Component {
 
  constructor(props) {
    super(props);
    this.web3 = null;
    this.state = {'connected': false, lastBlock: 0, latestBlock:{'hash': null}, messages:[{'from':'','value':'','number':''}]}
  }

  connectToProvider() {
    const provider = config.provider;
    try {
	let web3 = new Web3(new Web3.providers.HttpProvider(provider));
        this.web3 = web3;  
        web3.net.listening ? this.setState({connected:true}) : this.setState({connected: false});
    } catch (err) {
        console.log(err);
	this.setState({connected: false});
    }
  }
  


  getBlock(num='latest'){
    // should return the latest block in the chain
    const block = this.web3.eth.getBlock(num, true);
    //this.setState({'latestBlock': block});
    //console.log(block);
    return block;
  }


  getMessages(){
      let latestBlockNum = this.getBlock().number;
      let messages = {}
      for (let i = this.state.lastBlock + 1; i <= latestBlockNum;i++){
        let block = this.getBlock(i);
	if (block.transactions.length > 0){
	    block.transactions.map(t => {
	        messages[block.number] = {'from':t.from,'to':t.to, 'timestamp':block.timestamp,'input':Web3Utils.hexToAscii(t.input)};
		return;
	    })
	}
      }
      //console.log(messages);
      this.setState({lastBlock: latestBlockNum, messages: {...this.state.messages, ...messages}})
  }

  unlockAccount(hash,pass){
    this.web3.personal.unlockAccount(hash,pass,200);
    const transactionData = {
      'from': '0x49a344653d1791018b1e38714c53b76167e85553',
      'to': '0x2d416f8aaec76d3cea301e2e1df215b582121e9b',
      'value': this.web3.toWei('2','ether'),
      'gas': 200000,
      'data': this.web3.toHex('I made a thing!')
    };
    this.web3.eth.sendTransaction(transactionData, function(err,transactionHash){
      if(!err) console.log(transactionHash);
      if(err) console.log(err);
    });
  }

  getFriendly(hash){
    let name =  config.friendlyNames[hash]
    return name;
  }

  render() {
    return (
      <div className="App">
        <p>
	    provider: {config.provider}<br/> 
	    account: {config.accountID} <br/>
	    connected: {this.state.connected.toString()}<br/>
	    latestBlock: {this.state.latestBlock.hash}

	    {Object.keys(this.state.messages).map(message => {return (<div>{message}, {this.state.messages[message].input}, {this.getFriendly(this.state.messages[message].from)}, {this.state.messages[message].timestamp}</div>)})}
	</p>
	    <button onClick={() => {this.connectToProvider()}}>Connect</button>
	    <button onClick={() => {setInterval(()=>{this.getMessages()}, 3000);}}>get Messages</button>
	    <button onClick={() => {this.unlockAccount(Object.keys(config.friendlyNames)[0], 'testpassword')}}>Unlock Account</button>
            <MessageInput sendMessage={()=>{}} web3={this.web3}/>
	</div>
    );
  }
}

export default App;
