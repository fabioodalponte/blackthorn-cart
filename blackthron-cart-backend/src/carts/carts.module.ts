import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item-entity';
import { CartItemService } from './cart-item.service';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entity/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Item])],
  controllers: [CartsController],
  providers: [CartsService, CartItemService, ItemsService],
})
export class CartsModule {}
