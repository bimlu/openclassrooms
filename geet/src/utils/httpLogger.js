import morgan from 'morgan';
import json from 'morgan-json';
import { logger } from './logger';

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time',
  remoteAddress: ':remote-addr',
  remoteUser: ':remote-user',
  userAgent: ':user-agent',
});

export const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, contentLength, responseTime, remoteAddress, remoteUser, userAgent } = JSON.parse(
        message
      );

      logger.info('HTTP Access Log', {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime),
        remoteAddress,
        remoteUser,
        userAgent,
      });
    },
  },
});
