import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiGetResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean' }, // 성공 여부
              data: { $ref: getSchemaPath(model) }, // 단일 데이터
            },
            required: ['success', 'data'],
          },
        ],
      },
    }),
  );
};

export const ApiUpdateResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean' }, // 성공 여부
              data: { $ref: getSchemaPath(model) }, // 업데이트된 데이터
            },
            required: ['success', 'data'],
          },
        ],
      },
    }),
  );
};

export const ApiPostResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiCreatedResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean' }, // 성공 여부
              data: { $ref: getSchemaPath(model) }, // 생성된 데이터
            },
            required: ['success', 'data'],
          },
        ],
      },
    }),
  );
};

export const ApiGetItemsResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) }, // 배열 데이터
                  },
                  page: { type: 'integer', example: 1 }, // 페이지 정보
                  size: { type: 'integer', example: 20 }, // 페이지 크기
                },
                required: ['items', 'page', 'size'],
              },
            },
            required: ['success', 'data'],
          },
        ],
      },
    }),
  );
};

export const ApiDeleteResponse = () => {
  return applyDecorators(
    ApiNoContentResponse({
      description: 'Resource successfully deleted.',
    }),
  );
};
