// import { UserEntity } from 'src/modules/user/entities/user.entity';

import { User } from 'src/modules/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// declare module 'express' {
//   export interface Request {
//     user?: User;
//   }
// }

// declare module 'express-serve-static-core' {
//   export interface Request {
//     user?: User;
//   }
// }
