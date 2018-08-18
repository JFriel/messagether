import React, { Component } from 'react';
import { Badge, Modal, ModalBody } from 'reactstrap';
import './App.css';
import { config} from './config.js';
import MessageInput from './components/messageInput';
import ChatLogs from './components/chatLogs';
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const web3Admin = require('web3Admin');
class App extends Component {
 
  constructor(props) {
    super(props);
    this.web3 = null;
    this.getBlock = this.getBlock.bind(this);  
    this.web3Admin = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.getRecipient = this.getRecipient.bind(this);
    this.unlockAccount = this.unlockAccount.bind(this);
    this.isConnected = this.isConnected.bind(this);
    this.settingsModal = this.settingsModal.bind(this);
    this.state = {connected: false, lastBlock: 350, latestBlock:{'hash': null}, messages:{}, openSettings: false, lastSentTo: 0}
  }

  componentWillMount(){
    this.connectToProvider();
  }

  connectToProvider() {
    const provider = config.provider;
    try {
	let web3 = new Web3(new Web3.providers.HttpProvider(provider));
        this.web3 = web3;
	this.web3Admin = web3Admin.extend(web3);
        web3.net.listening ? this.setState({connected:true}) : this.setState({connected: false});
    } catch (err) {
        console.log(err);
	this.setState({connected: false});
    }
  }
  
  getBlock(num='latest'){
    // should return the latest block in the chain
    this.web3.eth.getBlock(num, true).then(
  	function(block){return block}
    );
  }


  getMessages(){
      console.log('getting messages');
      this.web3.eth.getBlock('latest',true).then( function(latestBlock){
        console.log(latestBlock.number);
        let messages = {}
        for (let i = this.state.lastBlock + 1; i <= latestBlock.number;i++){
          console.log('mining block: ', i);
            this.web3.eth.getBlock(i,true).then(function(currentBlock){
              if (currentBlock.transactions.length > 0){
	        currentBlock.transactions.map(t => {
	          messages[currentBlock.number] = {
			'from':t.from,
			'to':t.to,
			'timestamp':currentBlock.timestamp,
			'input':Web3Utils.hexToAscii(t.input)
		  };
                  return;
                });
	      }
	    }.bind(this))
        }
	  console.log('finished getting messages', messages);
       this.setState({lastBlock: latestBlock.number, messages: {...this.state.messages, ...messages}});
      }.bind(this));
  }

  unlockAccount(hash,pass){
    try {
	    this.web3.eth.defaultAccount = hash;
	    this.web3.eth.personal.unlockAccount(hash,pass,200);
    } catch (err) {
	    console.log(err);
            //thow err;
    }
    console.log('Account Unlocked');
    return new Promise(function(res,rej){res(true)})
  }

  getFriendly(hash){
    let name =  config.friendlyNames[hash]
    return name;
  }

  getRecipient(){
    // Round robin
    const numberOfAccounts = Object.keys(config.recipients).length;
    let newRecipient = this.state.lastSentTo + 1;
    if (newRecipient > numberOfAccounts) {newRecipient = 0};
    this.setState({lastSentTo: newRecipient});
    return newRecipient;
  }

  sendMessage(message){
    this.unlockAccount(config.accountID, config.password).then((res) => {
      const transactionData = {
        'from': config.account,
        'to': this.web3.eth.accounts[this.getRecipient()],
        'value': this.web3.utils.toWei('2','ether'),
        'gas': 200000,
        'data': this.web3.utils.toHex(message)
      };
      this.web3.eth.sendTransaction(transactionData, function(err,transactionHash){
        if(!err) console.log(transactionHash);
        if(err) {
	      console.log(err);
	      //throw err;
        }
      });
    });
  }
  
  isConnected(){
    if(this.state.connected){
	    return (<Badge color="success" pill>Connected</Badge>);
    } else {
	    return (<Badge color="danger" pill >Not Connected</Badge>);
    }
  }

  settingsModal(){
   return (
     <Modal isOpen={this.state.openSettings}>
	   <ModalBody>
	     testing
	   </ModalBody>
     </Modal>
   )
  }

  render() {
    let messages = (Object.keys(this.state.messages).length > 0) ?  (<ChatLogs messages={this.state.messages} />) : null;
    return (
      <div className="App">
	    {this.isConnected()}
	    {this.settingsModal()}
	    <button onClick={() => {this.setState({'openSettings': true})}}>Settings</button>
	    <button onClick={() => {this.getMessages()}}>get Messages</button>
	    <button onClick={() => {this.unlockAccount(Object.keys(config.friendlyNames)[0], 'testpassword')}}>Unlock Account</button>
	    {messages}
            <MessageInput sendMessage={this.sendMessage} />
	 </div>
    );
  }
}

export default App;
