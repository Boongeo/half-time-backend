// import { Column, Entity, OneToMany, OneToOne } from 'typeorm'; import { BaseEntity } from '../../../common/entity/base.entity';
// import { Account } from '../../../auth/entity/account.entity';
// import { Mentee } from '../../../mentee/entity/mentee.entity';
// import { Mentor } from '../../../mentor/entity/mentor.entity';
// import { UserRolesEntity } from './user-roles.entity';
//
// export class User extends BaseEntity {
//   profileImage?: string;
//
//   nickname: string;
//
//   account: Account;
//
//   mentee: Mentee;
//
//   mentor: Mentor;
//
//   userRoles: UserRolesEntity[];
//
//   setMentee(mentee: Mentee) {
//     this.mentee = mentee;
//     mentee.user = this;
//   }
// }
