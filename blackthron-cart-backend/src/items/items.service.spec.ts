import { Test, TestingModule } from '@nestjs/testing';
import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    repository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  describe('findAllItems', () => {
    it('should return an array of items', async () => {
      const items: Item[] = [
        { id: 1, name: 'Test Item 1', price: 10, stockAmount: 5 } as Item,
        { id: 2, name: 'Test Item 2', price: 20, stockAmount: 10 } as Item,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(items);

      const result = await service.findAllItems();

      expect(result).toEqual(items);
    });
  });
  describe('createItem', () => {
    it('should create a new item', async () => {
      const newItem: Partial<Item> = {
        name: 'New Item',
        price: 30,
        stockAmount: 15,
      };

      const createdItem: Item = {
        id: 1,
        name: newItem.name,
        price: newItem.price,
        stockAmount: newItem.stockAmount,
      } as Item;

      jest.spyOn(repository, 'create').mockReturnValue(createdItem);
      jest.spyOn(repository, 'save').mockResolvedValue(createdItem);

      const result = await service.createItem(newItem);

      expect(result).toEqual(createdItem);
    });
  });

  describe('findOneItem', () => {
    it('should return the item with the specified id', async () => {
      const itemId = 1;

      const item: Item = {
        id: itemId,
        name: 'Test Item',
        price: 10,
        stockAmount: 5,
      } as Item;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(item);

      const result = await service.findItemById(itemId);

      expect(result).toEqual(item);
    });
  });

  describe('updateItem', () => {
    it('should update the item with the specified id', async () => {
      const itemId = 5;

      //   const updatedItem: Partial<Item> = {
      //     name: 'Updated Item',
      //     price: 20,
      //     stockAmount: 10,
      //   };

      const item: Item = {
        id: itemId,
        name: 'Test Item',
        price: 10,
        stockAmount: 5,
      } as Item;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(item);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      //   const result = await service.updateItem(itemId, updatedItem);

      //   expect(result).toEqual(item);
      //   expect(result.name).toEqual(updatedItem.name);
      //   expect(result.price).toEqual(updatedItem.price);
      //   expect(result.stockAmount).toEqual(updatedItem.stockAmount);
    });
  });
});
