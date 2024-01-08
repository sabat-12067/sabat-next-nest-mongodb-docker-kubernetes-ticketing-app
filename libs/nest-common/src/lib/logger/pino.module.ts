/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

// Fields to redact from logs
const redactFields = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.confirmPassword',
];
const basePinoOptions = {
  translateTime: true,
  ignore: 'pid,hostname',
  singleLine: true,
  redact: redactFields,
};

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          timestamp: () =>
            `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
          name: process.env['HOSTNAME'] || 'nx-nest',
          customProps: (_request, _response) => ({
            context: 'HTTP',
          }),
          quietReqLogger: true,
          genReqId: function (req: any, res: any) {
            const existingID = req.id ?? req.headers['x-request-id'];
            if (existingID) return existingID;
            const id = randomUUID();
            res.setHeader('X-Request-Id', id);
            return id;
          },
          serializers: {
            req(request: {
              body: Record<string, any>;
              raw: {
                body: Record<string, any>;
              };
            }) {
              request.body = request.raw.body;

              return request;
            },
          },
          redact: {
            paths: redactFields,
            censor: '**GDPR COMPLIANT**',
          },
          level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
          transport:
            process.env['NODE_ENV'] === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    ...basePinoOptions,
                  },
                }
              : undefined,
        },
        exclude: [{ method: RequestMethod.ALL, path: 'doc' }],
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class NestPinoModule {}
