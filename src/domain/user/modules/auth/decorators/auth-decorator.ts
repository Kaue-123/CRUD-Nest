import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

export function AuthLoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Autentica um usuário e retorna um token JWT',
      description:
        'Recebe nome e senha, autentica e retorna um token JWT válido.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'kaue' },
          password: { type: 'string', example: 'minhaSenha123' },
        },
        required: ['name', 'password'],
      },
      description: 'Credenciais do usuário para login',
    }),
    ApiResponse({
      status: 200,
      description: 'Login realizado com sucesso. Retorna o token JWT.',
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'jwt.token.aqui' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciais inválidas ou usuário não autorizado.',
    }),
  );
}
