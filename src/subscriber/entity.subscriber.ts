import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../user/entity/roles.entity';
import { Role } from '../user/enums/role.enum';
import { Interest } from '../interest/entity/interest.entity';
import { TechStack } from '../tech-stack/entity/tech-stack.entity';

@Injectable()
export class EntitySubscriber implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    const roleEntityRepository = this.dataSource.getRepository(RoleEntity);
    const interestEntityRepository = this.dataSource.getRepository(Interest);
    const techStackEntityRepository = this.dataSource.getRepository(TechStack);

    // RoleEntity에 데이터가 있는지 확인
    const roleCount = await roleEntityRepository.count();
    if (roleCount === 0) {
      // 데이터 삽입
      await roleEntityRepository.save([
        { role: Role.USER },
        { role: Role.MENTOR },
        { role: Role.ADMIN },
      ]);
      console.log('Default roles inserted');
    } else {
      console.log('Roles already exist');
    }

    const InterestCount = await interestEntityRepository.count();
    if (InterestCount === 0) {
      // 데이터 삽입
      await interestEntityRepository.save([
        { interest: 'BackEnd' },
        { interest: 'FrontEnd' },
        { interest: 'DevOps' },
      ]);
      console.log('Default interest inserted');
    } else {
      console.log('Interest already exist');
    }

    const techStackCount = await techStackEntityRepository.count();
    if (techStackCount === 0) {
      // 데이터 삽입
      await techStackEntityRepository.save([
        { tech: 'spring' },
        { tech: 'nest' },
        { tech: 'react' },
        { tech: 'next' },
      ]);
      console.log('Default techStack inserted');
    } else {
      console.log('TechStack already exist');
    }
  }
}
