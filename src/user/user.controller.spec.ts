import { Test, TestingModule } from '@nestjs/testing';
import { UserAfterAuth } from 'src/common/decorater/user.decorator';
import { Role } from './enums/role.enum';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FindUserReqDto, UpdateProfileReqDto } from './dto/req.dto';
import { ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('User Controller', () => {
  let userController: UserController; // UserController 객체를 선언
  let userService: UserService; // UserService 객체를 선언

  const mockUser: UserAfterAuth = {
    id: '123',
    email: 'test@example.com',
    roles: [Role.USER, Role.MENTOR],
  };

  const mockDto: UpdateProfileReqDto = {
    nickname: 'TestUser',
    interestNames: ['BackEnd', 'FrontEnd'],
    introduction: 'Hi',
  };

  const mockFile: Express.Multer.File = {
    originalname: 'profile.jpg',
    filename: 'uploaded/profile.jpg',
    mimetype: 'image/jpeg',
    size: 12345,
    buffer: Buffer.from(''),
    fieldname: 'profileImage',
    encoding: '7bit',
    stream: null,
    destination: '',
    path: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController], // UserController를 테스트 모듈의 'controllers'로 등록합니다.
      providers: [
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: UserService, // UserService를 DI로 주입하여 테스트 모듈의 'providers'로 등록합니다.
          useValue: {
            findMyProfile: jest.fn(), // UserService의 findMyProfile 메서드를 모킹하여 빈 함수로 대체합니다.
            registerProfile: jest.fn(),
            updateProfile: jest.fn(),
            roleAssigned: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController); // TestingModule에서 UserController 인스턴스를 가져옵니다.
    userService = module.get<UserService>(UserService); // TestingModule에서 UserService 인스턴스를 가져옵니다.
  });

  describe('register', () => {
    it('프로필을 등록합니다', async () => {
      const mockResponse = {
        email: 'test@example.com',
        nickname: 'TestUser',
        roles: [Role.USER, Role.MENTOR],
        profileImage: 'upload/profile.jpg',
      };

      jest
        .spyOn(userService, 'registerProfile')
        .mockResolvedValue(mockResponse);

      // Act: Call the controller method
      const result = await userController.register(mockUser, mockDto, mockFile);

      // Assert: Verify the method behavior
      expect(result).toEqual(mockResponse); // 반환값 확인
      expect(userService.registerProfile).toHaveBeenCalledWith(
        mockUser,
        mockDto,
        mockFile,
      ); // 호출 시 인자 확인
      expect(userService.registerProfile).toHaveBeenCalledTimes(1); // 호출 횟수 확인
    });

    it('프로필 이미지가 없는 경우도 처리합니다.', async () => {
      // Arrange: Mock inputs without a file
      const mockUser: UserAfterAuth = {
        id: '123',
        email: 'test@example.com',
        roles: [Role.USER],
      };

      const mockDto: UpdateProfileReqDto = {
        nickname: 'TestUser',
        interestNames: ['BackEnd', 'FrontEnd'],
        introduction: 'This is a test introduction',
      };

      const mockResponse: {
        email: string;
        nickname: string;
        roles: Role[];
        profileImage: string;
      } = {
        email: 'test@example.com',
        nickname: 'TestUser',
        roles: [Role.USER, Role.MENTOR],
        profileImage: undefined,
      };

      jest
        .spyOn(userService, 'registerProfile')
        .mockResolvedValue(mockResponse);

      // Act: Call the controller method without a file
      const result = await userController.register(
        mockUser,
        mockDto,
        undefined,
      );

      // Assert: Verify the method behavior
      expect(result).toEqual(mockResponse); // 반환값 확인
      expect(userService.registerProfile).toHaveBeenCalledWith(
        mockUser,
        mockDto,
        undefined,
      ); // 호출 시 파일이 없는 경우 확인
      expect(userService.registerProfile).toHaveBeenCalledTimes(1); // 호출 횟수 확인
    });
  });

  describe('me', () => {
    it('프로필 정보를 반환합니다', async () => {
      // 입력값과 결과값을 반환할 mock 객체 생성
      const mockProfile: {
        email: string;
        nickname: string;
        roles: Role[];
        profileImage: string;
      } = {
        email: 'test@example.com',
        nickname: 'TestUser',
        roles: [Role.USER, Role.MENTOR],
        profileImage: 'upload/profile.jpg',
      };

      jest.spyOn(userService, 'findMyProfile').mockResolvedValue(mockProfile); // findMyProfile을 감시하며 실행됐을때 return됐을때 값은 mockProfile임

      const result = await userController.me(mockUser);

      expect(result).toEqual(mockProfile); // result값이 mockProfile과 일치하는지
      expect(userService.findMyProfile).toHaveBeenCalledWith(mockUser); // userService의 findMyProfile 메서드가 호출될 때 mockUser가 인자로 전달되었는지
      expect(userService.findMyProfile).toHaveBeenCalledTimes(1); // 메서드가 정확히 한번 호출되었는지
    });
  });

  describe('updateMyProfile', () => {
    it('프로필 정보를 업데이트합니다', async () => {
      const mockResponse = {
        email: 'test@example.com',
        nickname: 'TestUser',
        roles: [Role.USER, Role.MENTOR],
        profileImage: 'upload/profile.jpg',
      };

      const mockProfile: {
        email: string;
        nickname: string;
        roles: Role[];
        profileImage: string;
      } = {
        email: 'test@example.com',
        nickname: 'TestUser',
        roles: [Role.USER, Role.MENTOR],
        profileImage: 'upload/profile.jpg',
      };
      jest.spyOn(userService, 'updateProfile').mockResolvedValue(mockProfile); // findMyProfile을 감시하며 실행됐을때 return됐을때 값은 mockProfile임

      const result = await userController.updateMyProfile(
        mockUser,
        mockDto,
        mockFile,
      );

      expect(result).toEqual(mockResponse); // 반환값 확인
      expect(userService.updateProfile).toHaveBeenCalledWith(
        mockUser,
        mockDto,
        mockFile,
      ); // 호출 시 파일이 없는 경우 확인
      expect(userService.updateProfile).toHaveBeenCalledTimes(1); // 호출 횟수 확인
    });
    it('mockProfile에 nickname이 없을 경우 에러를 반환합니다', async () => {
      // Arrange: Mock 데이터 준비 (nickname 누락)
      const mockUser: UserAfterAuth = {
        id: '123',
        email: 'test@example.com',
        roles: [Role.USER],
      };

      const mockDto: UpdateProfileReqDto = {
        nickname: '', // nickname이 빈 문자열로 전달됨
        interestNames: ['BackEnd', 'FrontEnd'],
        introduction: 'This is a test introduction',
      };

      jest.spyOn(userService, 'updateProfile').mockImplementation(() => {
        throw new Error('Nickname is required'); // 서비스에서 예외 발생
      });

      // Act & Assert: 컨트롤러 호출 및 예외 검증
      await expect(
        userController.updateMyProfile(mockUser, mockDto, undefined),
      ).rejects.toThrow('Nickname is required'); // 예외 메시지 확인

      expect(userService.updateProfile).toHaveBeenCalledWith(
        mockUser,
        mockDto,
        undefined,
      ); // 호출 시 인자 확인
      expect(userService.updateProfile).toHaveBeenCalledTimes(1); // 호출 횟수 확인
    });
  });

  describe('roleAssigned', () => {
    let executionContextMock: Partial<ExecutionContext>;

    beforeEach(() => {
      executionContextMock = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { id: 'userId', roles: [Role.USER] }, // 기본적으로 권한 없음
          }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };
    });

    it('역할을 할당합니다.', async () => {
      const mockDto: FindUserReqDto = { id: '123' };
      const mockResponse = {
        nickname: 'JohnDoe',
        roles: [Role.USER, Role.ADMIN],
      };

      // Admin 권한 추가
      (executionContextMock.switchToHttp() as any).getRequest.mockReturnValue({
        user: { id: 'adminId', roles: [Role.ADMIN] },
      });

      jest.spyOn(userService, 'roleAssigned').mockResolvedValue(mockResponse);

      const result = await userController.roleAssigned(mockDto);

      expect(result).toEqual(mockResponse); // 반환값 확인
      expect(userService.roleAssigned).toHaveBeenCalledWith(mockDto.id); // 호출된 인자 확인
      expect(userService.roleAssigned).toHaveBeenCalledTimes(1); // 호출 횟수 확인
    });
  });
});
