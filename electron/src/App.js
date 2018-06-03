import React, { Component } from 'react';
import './App.css';
import { config} from './config.js';
const Web3 = require('web3');

class App extends Component {
 
  constructor(props) {
    super(props);
    this.web3 = null;
    this.state = {'connected': false, latestBlock:{'hash': null}, messages:['t1','t2']}
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
  


  getBlock(){
    // should return the latest block in the chain
    const block = this.web3.eth.getBlock('latest', true);
    //this.setState({'latestBlock': block});
    //console.log(block);
    return block;
  }

  getMessages(){
    if(this.web3 != null){
    let block = this.getBlock()
    if (block != this.state.latestBlock){
      this.setState({'latestBlock': block});
      console.log(block);
      if (block.transactions.length !== 0) {
        block.transactions.map(t => {
	  console.log(t);
	  console.log(this.web3.utils.hexToAscii(t.input));
          //this.setState({'messages': this.state.messages.append(t.
	});
      }
    }}
  }

  render() {
    return (
      <div className="App">
        <p>
	    provider: {config.provider}<br/> 
	    account: {config.accountID} <br/>
	    connected: {this.state.connected.toString()}<br/>
	    latestBlock: {this.state.latestBlock.hash}

	    {this.state.messages.map(message => {return (<div>{message}</div>)})}
	</p>
	    <button onClick={() => {this.connectToProvider()}}>Connect</button>
	    <button onClick={() => {setInterval(()=>{this.getMessages()}, 3000);}}>get Messages</button>
      </div>
    );
  }
}

export default App;
