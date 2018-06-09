import React, {Component} from 'react';
import {config} from '../config';
class ChatLogs extends Component {
   
    constructor(props) {
      super(props);
      this.generateMessages = this.generateMessages.bind(this);
      this.state = {};
    }

    generateMessages() {
      const tableStyle = {
        border: '1px solid #ddd',
	'text-align': 'left',
	'display': 'inline-block',
	'max-height': '300px',
	'overflow-y': 'scroll'
      }

      const tdStyle = {
	'padding': '3px',
      }

      let messages = this.props.messages;
      let content = Object.keys(messages).map(message => (
	      <tr>
                <td style={tdStyle}>{config.friendlyNames[messages[message].from]}: </td>
	        <td style={tdStyle}>{messages[message].input}</td>
	      </tr>
      )); 
      return (<table id="messagLogs" style={tableStyle}>{content}</table>);
    }

    render() {
    
      return (
        <div>
	  <style>{"tr:nth-child(even) {background-color: #f2f2f2;}"}</style>
          {this.generateMessages()}
	</div>
      )
    }
}

export default ChatLogs;
