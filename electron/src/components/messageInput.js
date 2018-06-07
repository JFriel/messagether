import React, {Component} from 'react';

class MessageInput extends Component {

    constructor(props) {
      super(props);
      this.web3 = this.props.web3;
      this.state= {messageValue:''};
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(input){
      this.setState({messageValue:input.target.value});
    }

    render() {
      return (
        <div>
           <input type='text' value={this.state.messageValue} onChange={this.handleChange}/><button onClick={this.props.sendMessage}>Send</button>
	</div>
      )
    }
}

export default MessageInput
