import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  if (process.env.NODE_ENV !== 'production') {
    app.getHttpAdapter().getInstance().set('json spaces', 2);
  }
  const Port = process.env['PORT'];
  const Host = process.env['HOST'];
  await app.listen(Port, Host);
  console.log('Server is running');
})();
