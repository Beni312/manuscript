import { Author } from '../../models/author';
import { Message } from '../../models/message';
import { MessageActions, MessageActionTypes } from './MessageActions';

export interface MessageState {
  messages: Map<number, Array<Message>>;
  users: Author[];
}

export const initialState: MessageState = {
  messages: new Map<number, Array<Message>>(),
  users: []
};

export function messageReducer(state: MessageState = initialState, action: MessageActions): MessageState {
  switch (action.type) {
    case MessageActionTypes.AddMessage:
      let messagesToPartner: Message[] = state.messages[action.payload.to];
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
        messages: action.payload.messages,
        users: action.payload.users
      }
  }

}
