import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env['CORS_SITE'], credentials: false },
    logger: ['error', 'warn'],
  });
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );
  if (process.env.NODE_ENV !== 'production') {
    app.getHttpAdapter().getInstance().set('json spaces', 2);
  }
  const Port = process.env['PORT'];
  const Host = process.env['HOST'];
  await app.listen(Port, Host);
  console.log('Server is running');
})();
