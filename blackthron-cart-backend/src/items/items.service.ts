import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entity/item.entity';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ){}

    async createItem(itemData: Partial<Item>): Promise<Item> {
        const newItem = this.itemRepository.create(itemData);
        return this.itemRepository.save(newItem);
    }

    async findAllItems(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    async findItemById(id: number): Promise<Item | undefined> {
        return this.itemRepository.findOneBy({id});
    }
    
}
