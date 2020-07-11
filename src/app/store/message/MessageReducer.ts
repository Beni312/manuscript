import { Message } from '../../models/message';
import { MessageActions, MessageActionTypes } from './MessageActions';
import { Messages } from '../../modules/user/components/messages/messages.component';

export interface MessageState {
  messages: Messages;
}

const initialState: MessageState = {
  messages: new Messages()
};

export function messageReducer(state: MessageState = initialState, action: MessageActions): MessageState {
  switch (action.type) {
    case MessageActionTypes.AddMessage:
      const messagesToPartner: Message[] = state.messages[action.payload.to];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.to]: messagesToPartner ? [...messagesToPartner, action.payload] : [action.payload]
        }
      };
    case MessageActionTypes.SignMessageAsSeen:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload]: state.messages[action.payload].map(m => ({
            ...m,
            seen: true
          }))
        }
      };
    case MessageActionTypes.InitUserMessages:
      return {
        ...state,
        messages: action.payload
      };
    default: return state;
  }
}
