import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
export class Board extends BaseEntity {
  @Column()
  title: string;

  @Column()
  body: string;
}
