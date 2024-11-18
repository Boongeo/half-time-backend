import { Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

//TODO : 설계만 대략적으로 잡아놓고 추후 스케쥴 로직 작성 시 수정할 예정입니다.
@Entity()
export class MentoringSession extends BaseEntity {}
