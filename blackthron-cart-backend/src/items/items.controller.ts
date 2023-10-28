import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService) {}

    @Post()
    create(@Body() itemData: Partial<Item>) {
        return this.itemsService.createItem(itemData);
    }

    @Get()
    findAll() {
        return this.itemsService.findAllItems();
    }

    @Get(':id')
    findOne(@Param('id') id:number) {
        return this.itemsService.findItemById(id);
    }

    @Put(':id')
    update(@Param('id') id:number, @Body() itemData: Partial<Item>) {
        return this.itemsService.updateItem(id, itemData);
    }

    @Delete(':id')
    remove(@Param('id') id:number)  {
        return this.itemsService.deleteItem(id);
    }

}
