import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './entity/item.entity';
import { mock } from 'ts-mockito';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mock(ItemsService),
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    controller = module.get<ItemsController>(ItemsController);
  });

  describe('findAll', () => {
    it('should call the findAllItems method of the ItemsService', async () => {
      const findAllItemsSpy = jest.spyOn(service, 'findAllItems');

      await controller.findAll();
      expect(findAllItemsSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call the createItem method of the ItemsService with the correct arguments', async () => {
      const createItemSpy = jest.spyOn(service, 'createItem');

      const newItem: Partial<Item> = {
        name: 'New Item',
        price: 30,
        stockAmount: 15,
      };

      await controller.create(newItem);

      expect(createItemSpy).toHaveBeenCalledWith(newItem);
    });
  });
});
