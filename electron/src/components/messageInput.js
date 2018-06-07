import React, {Component} from 'react';

class MessageInput extends Component {

    constructor(props) {
      super(props);
      this.state= {messageValue:''};
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(input){
      this.setState({messageValue:input.target.value});
    }

    render() {
      return (
        <div>
           <input type='text' value={this.state.messageValue} onChange={this.handleChange}/><button onClick={() => this.props.sendMessage(this.state.messageValue)}>Send</button>
	</div>
      )
    }
}

export default MessageInput
