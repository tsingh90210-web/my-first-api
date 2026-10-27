import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a healthy status', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('healthy');
    expect(result.service).toBe('my-first-api');
    expect(typeof result.timestamp).toBe('string');
  });
});
