import { Action } from '@ngrx/store';
import { Message } from '../../models/message';
import { MessagePreload } from '../../modules/user/components/messages/messages.component';

export enum MessageActionTypes {
  InitUserMessages = 'Init user messages',
  AddMessage = '[AddMessage] Add message',
  SignMessageAsSeen = '[SignMessageAsSeen] Sign message as seen'
}

export class AddMessage implements Action {
  readonly type = MessageActionTypes.AddMessage;

  constructor(public payload: Message) {}
}

export class SignMessageAsSeen implements Action {
  readonly type = MessageActionTypes.SignMessageAsSeen;

  constructor(public payload: number) {}
}

export class InitUserMessages implements Action {
  readonly type = MessageActionTypes.InitUserMessages;

  constructor(public payload: MessagePreload) {}
}

export type MessageActions =
  AddMessage |
  SignMessageAsSeen |
  InitUserMessages;
