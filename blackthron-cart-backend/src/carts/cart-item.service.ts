/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async save(cartItem: Partial<CartItem>): Promise<CartItem> {
    return this.cartItemRepository.save(cartItem);
  }

  async update(cartItem: Partial<CartItem>) {
    await this.cartItemRepository.update(cartItem.id, cartItem);
  }

  async updateCartItemQuantity(
    id: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOneBy({ id });
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async findCartItemByCartAndItem(cartId: number, itemId: number): Promise<CartItem> {
    return await this.cartItemRepository.findOne({ 
      where: { 
        cart: { id: cartId }, 
        item: { id: itemId } 
      } 
    });
  }

  async deleteCartItem(id: number): Promise<void> {
    await this.cartItemRepository.delete(id);
  }
}
