import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity('Board')
export class BoardEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  body: string;
}
