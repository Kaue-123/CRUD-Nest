import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cria um novo usuário',
      description: 'Endpoint para criar um usuário no sistema.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'kaue' },
          email: { type: 'string', example: 'kaue@example.com' },
          password: { type: 'string', example: 'senhaSegura123' },
        },
        required: ['name', 'email', 'password'],
      },
      description: 'Dados necessários para criar um usuário',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-do-usuario' },
          name: { type: 'string', example: 'kaue' },
          email: { type: 'string', example: 'kaue@example.com' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Erro de validação. Email ou senha ausentes ou inválidos.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string', example: 'E-mail obrigatório.' },
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
}

export function FindUserByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Busca usuário por ID',
      description: 'Retorna os dados de um usuário pelo seu ID.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID do usuário',
      example: 'uuid-do-usuario',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário encontrado',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-do-usuario' },
          name: { type: 'string', example: 'kaue' },
          email: { type: 'string', example: 'kaue@example.com' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
    }),
  );
}

export function UpdateUserPasswordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza a senha do usuário',
      description: 'Permite ao usuário atualizar sua senha.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID do usuário',
      example: 'uuid-do-usuario',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          password: { type: 'string', example: 'novaSenhaSegura123' },
        },
        required: ['password'],
      },
      description: 'Nova senha do usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Senha atualizada com sucesso',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado.',
    }),
  );
}

export function DeleteUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove usuário',
      description: 'Remove um usuário do sistema pelo ID.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID do usuário',
      example: 'uuid-do-usuario',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário removido com sucesso',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'Usuário removido com sucesso' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token inválido ou expirado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: {
            type: 'array',
            items: { type: 'string', example: 'Token inválido ou expirado ' },
          },
          error: { type: 'string', example: 'Unathorized' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Usuário não encontrado' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
}
