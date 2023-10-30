/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item-entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCartItem(createCartItem: Partial<CartItem>): Promise<CartItem> {
    const newCartItem = this.cartItemRepository.create(createCartItem);
    return this.cartItemRepository.save(newCartItem);
  }

  async updateCartItemQuantity(
    id: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOneBy({ id });
    if (!cartItem) {
      //TODO Handle error (cart item not found)
    }

    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async deleteCartItem(id: number): Promise<void> {
    await this.cartItemRepository.delete(id);
  }
}
