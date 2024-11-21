import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../user/entity/roles.entity';
import { Role } from '../user/enums/role.enum';

@Injectable()
export class RoleEntitySubscriber implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    const repository = this.dataSource.getRepository(RoleEntity);

    // RoleEntity에 데이터가 있는지 확인
    const count = await repository.count();
    if (count === 0) {
      // 데이터 삽입
      await repository.save([
        { role: Role.USER },
        { role: Role.MENTOR },
        { role: Role.ADMIN },
      ]);
      console.log('Default roles inserted');
    } else {
      console.log('Roles already exist');
    }
  }
}
