// import { UserEntity } from 'src/modules/user/entities/user.entity';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserEntity;
//     }
//   }
// }

import { User } from 'src/modules/users/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}

// declare module 'express-serve-static-core' {
//   export interface Request {
//     user?: UserEntity;
//   }
// }
