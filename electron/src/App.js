import React, { Component } from 'react';
import './App.css';
import { config} from './config.js';
const Web3 = require('web3');

class App extends Component {
 
  constructor(props) {
    super(props);
    this.web3 = null;
    this.state = {'connected': false, latestBlock:{'hash': null}}
  }

  connectToProvider() {
    const provider = config.provider;
    try {
	let web3 = new Web3(new Web3.providers.HttpProvider(provider));
        this.web3 = web3;  
        web3.eth.net.isListening() ? this.setState({connected:true}) : this.setState({connected: false});
    } catch (err) {
        console.log(err);
	this.setState({connected: false});
    }
  }
 
  getBlock(){
    // should return the latest block in the chain
    const block = this.web3.eth.getBlock(this.web3.eth.blockNumber, true);
    this.setState({'latestBlock': block});
    console.log(block);
  }
	
  render() {
    console.log(config);
    return (
      <div className="App">
        <p>
	    provider: {config.provider}<br/> 
	    account: {config.accountID} <br/>
	    connected: {this.state.connected.toString()}<br/>
	    latestBlock: {this.state.latestBlock.hash}
	</p>
	    <button onClick={() => {this.connectToProvider()}}>Connect</button>
	    <button onClick={() => {this.getBlock()}}>GetBlock</button>
      </div>
    );
  }
}

export default App;
