import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import SingleMessageBox from './SingleMessageBox';

import { CREATE_MESSAGE } from 'graphql/messages';
import { GET_CONVERSATIONS } from 'graphql/user';

import * as Routes from 'routes';
import theme from 'muiTheme';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '10vh',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      bottom: '13vh',
    },
  },
  input: {},
  root: {
    overflowY: 'auto',
    maxHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    // temp fix for iphone5 or smaller
    [theme.breakpoints.down('330')]: {
      width: '96%',
    },
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.text.secondary,
      borderRadius: theme.spacing(2),
      visibility: 'hidden',
      '&:hover': {
        background: theme.palette.text.primary,
      },
    },
    '&:hover': {
      '&::-webkit-scrollbar-thumb': {
        visibility: 'visible',
      },
    },
  },
  conversation: {},
}));

/**
 * Component that renders messages conversations UI
 */
const MessagesChatConversation = ({ messages, authUser, chatUser, data, match }) => {
  const classes = useStyles();
  const bottomRef = useRef(null);
  const buttonEl = useRef(null);
  const TextareaEl = useRef(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [bottomRef, data]);

  const [createMessage, { loading }] = useMutation(CREATE_MESSAGE);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageText) return;

    setMessageText('');
    createMessage({
      variables: {
        input: {
          sender: authUser.id,
          receiver: chatUser ? chatUser.id : null,
          message: messageText,
        },
      },
      refetchQueries: ({ data }) => {
        if (data && data.createMessage && data.createMessage.isFirstMessage) {
          return [
            {
              query: GET_CONVERSATIONS,
              variables: { authUserId: authUser.id },
            },
          ];
        }
      },
    });
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      buttonEl.current.click();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.conversation}>
        {messages.map((message) => (
          <SingleMessageBox key={message.id} message={message} isAuthUserReceiver={authUser.id === message.sender.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {match.params.userId !== Routes.NEW_ID_VALUE && chatUser && (
        <form onSubmit={sendMessage} className={classes.form}>
          <Input
            id="message"
            placeholder="Type a message..."
            onKeyDown={onEnterPress}
            ref={TextareaEl}
            multiline
            fullWidth
            rows={1}
            rowsMax={3}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            variant="filled"
            className={classes.input}
            disabled={loading}
          />

          <IconButton
            type="submit"
            color={messageText ? 'primary' : 'default'}
            ref={buttonEl}
            disabled={!messageText || loading}
          >
            <SendIcon />
          </IconButton>
        </form>
      )}
    </div>
  );
};

MessagesChatConversation.propTypes = {
  messages: PropTypes.array.isRequired,
  authUser: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
  data: PropTypes.any,
  match: PropTypes.object.isRequired,
};

export default MessagesChatConversation;
