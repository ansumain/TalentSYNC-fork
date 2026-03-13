import { UserInfo } from './UserInfo';

declare global {
  namespace Express {
    interface Request {
      userInfo: UserInfo;
    }
  }
}

export {}