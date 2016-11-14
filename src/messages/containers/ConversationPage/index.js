/**
 * Created by Frezc on 2016/11/7.
 */
import React, { PureComponent, PropTypes } from 'react';
import OneSpeakSection from '../../../components/OneSpeakSection';
import ChatInput from '../../components/ChatInput';
import { getParams, getSelf, mobilePost, getSelfSync, mobileGet } from '../../helpers';
import api from '../../../network/api';
import LocalIdArray from 'local-id-array';

import './style.scss';

class ConversationPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    total: 0,
    conversations: new LocalIdArray(),
    input: ''
  };

  fetchData(refresh = false) {
    const targetId = this.props.params.id;
    mobileGet(api.conversations, {
      target_id: targetId,
      off: refresh ? 0 : this.state.conversations.length
    }).then(json => {
      const { scrollHeight: prevSh } = this.scrollView;
      this.setState({
        total: json.total,
        conversations: this.state.conversations.unshift(...json.list.reverse())
      }, () => {
        if (refresh) {
          this.scrollToBottom();
        } else {
          this.scrollView.scrollTop += this.scrollView.scrollHeight - prevSh;
        }
      });
    })
  }

  scrollToBottom = () => {
    this.scrollView.scrollTop = this.scrollView.scrollHeight;
  };

  sendMessage = () => {
    const targetId = this.props.params.id;

    mobilePost(api.conversations, {
      receiver_id: targetId,
      content: this.state.input
    });
    getSelf().then(self => {
      this.setState((prevState) => ({
        total: prevState.total + 1,
        conversations: prevState.conversations.push({
          sender_id: self.id,
          sender_name: self.nickname,
          sender_avatar: self.avatar,
          content: prevState.input
        }),
        input: ''
      }), this.scrollToBottom);
    });
  };

  handleScroll = e => {
    if (e.target.scrollTop <= 0) {
      this.fetchData();
    }
  };

  componentDidMount() {
    const targetId = this.props.params.id;
    this.fetchData(true);
  }

  render() {
    const {} = this.props;
    const { conversations, input } = this.state;

    const selfId = getParams('id');
    return (
      <div className="fill conversation-page">
        <div className="conver-area"
             ref={r => this.scrollView = r}
             onScroll={this.handleScroll}>
          {conversations.map((conv, id) =>
            <OneSpeakSection
              key={id}
              avatar={conv.sender_avatar}
              attachRight={conv.sender_id == selfId}
            >
              {conv.content}
            </OneSpeakSection>
          )}
        </div>
        <ChatInput
          value={input}
          onChange={input => this.setState({ input })}
          disabled={!input}
          onSubmit={this.sendMessage}
        />
      </div>
    )
  }
}

export default ConversationPage
