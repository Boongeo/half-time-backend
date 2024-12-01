import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/enums/role.enum';
import { TechStack } from '../entity/tech-stack.entity';

export class TechStackResDto {
  @ApiProperty()
  name: string;
}

export class AllTechStackResDto {
  @ApiProperty()
  techNames: string[];

  static toDto(techStacks: TechStack[]): AllTechStackResDto {
    const dto = new AllTechStackResDto();
    dto.techNames = techStacks.map((techStack) => techStack.tech);
    return dto;
  }
}
