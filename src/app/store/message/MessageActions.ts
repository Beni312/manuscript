import { Action } from "@ngrx/store";
import { Message } from "../../models/message";
import { MessagePreload } from "../../modules/user/components/messages/messages.component";

export enum MessageActionTypes {
  InitUserMessages = 'Init user messages',
  AddMessage = '[AddMessage] Add message'

}

export class AddMessage implements Action {
  readonly type = MessageActionTypes.AddMessage;

  constructor(public payload: Message) {}
}

export class InitUserMessages implements Action {
  readonly type = MessageActionTypes.InitUserMessages;

  constructor(public payload: MessagePreload) {}
}

export type MessageActions =
  AddMessage |
  InitUserMessages;
