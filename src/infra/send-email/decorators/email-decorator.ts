import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function SendEmailDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Envia um e-mail para a fila',
      description:
        'Adiciona um job de envio de e-mail na fila. Requer autenticação JWT.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          to: { type: 'string', example: 'destinatario@email.com' },
          subject: { type: 'string', example: 'Assunto do e-mail' },
          text: { type: 'string', example: 'Conteúdo do e-mail' },
        },
        required: ['to', 'subject', 'text'],
      },
      description: 'Dados do e-mail a ser enviado',
    }),
    ApiResponse({
      status: 200,
      description: 'E-mail entrou para a fila com sucesso',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'Entrou para a fila' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description:
        'Erro de validação. Formato de e-mail inválido, destinatário ou assunto obrigatórios.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string', example: 'Destinatário é obrigatório' },
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
      examples: {
        emailInvalido: {
          summary: 'Formato de e-mail inválido',
          value: {
            statusCode: 400,
            message: ['Formato de e-mail inválido'],
            error: 'Bad Request',
          },
        },
        destinatarioObrigatorio: {
          summary: 'Destinatário obrigatório',
          value: {
            statusCode: 400,
            message: ['Destinatário é obrigatório'],
            error: 'Bad Request',
          },
        },
        assuntoObrigatorio: {
          summary: 'Assunto do e-mail é obrigatório',
          value: {
            statusCode: 400,
            message: ['Assunto do e-mail é obrigatório'],
            error: 'Bad Request',
          },
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
            items: { type: 'string', example: 'Token inválido ou expirado' },
          },
          error: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno ao enviar o e-mail',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: {
            type: 'string',
            example: 'Error sending email: Queue error',
          },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
}
