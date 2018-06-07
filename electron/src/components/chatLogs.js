import React, {Component} from 'react';

class ChatLogs extends Component {
   
    constructor(props) {
      super(props);
      this.generateMessages = this.generateMessages.bind(this);
      this.state = {};
    }

    generateMessages() {
      let messages = this.props.messages;
      console.log(messages[0])
      return Object.keys(messages).map(message => (<div> {messages[message].from}: {messages[message].input} </div>))
    }


    render() {
    
      return (
        <div>
          {this.generateMessages()}
	</div>
      )
    }
}

export default ChatLogs;
