export enum Role {
  DEALER = 'DEALER',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  PM = 'PM',
  RM = 'RM',
}

export interface Player {
  id: string;
  role: Role;
  name: string;
  scores: number[];
}

export interface SessionPlayer {
  name: string;
  role: Role;
}

export interface ChatMessage {
  sender: string;
  message: string;
  dateTime: string;
}
