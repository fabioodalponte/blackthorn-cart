import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemService } from './cart-item.service';
import { Cart } from './entities/cart.entity';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private cartItemService: CartItemService,
    private itemsService: ItemsService,
  ) {}

  async createCart(createCart: Cart): Promise<Cart> {
    const newCart = this.cartRepository.create(createCart);
    return this.cartRepository.save(newCart);
  }

  async getCartById(id: number): Promise<Cart | undefined> {
    return this.cartRepository.findOneBy({ id });
  }

  async removeItemFromCart(cartId: number, cartItemId: number): Promise<void> {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (!cart.cartItems) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    const cartItem = cart.cartItems.find((item) => item.id === cartItemId);
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    await this.cartItemService.deleteCartItem(cartItemId);
  }

  async addItemToCart(
    cartId: number,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const item = await this.itemsService.findItemById(itemId);

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const cartItem = await this.cartItemService.createCartItem({
      cart,
      item,
      quantity,
    });

    if (!cart.cartItems) {
      cart.cartItems = [];
    }

    cart.cartItems.push(cartItem);
    cart.total = await this.calculateCartTotal(cart);

    return this.cartRepository.save(cart);
  }

  async calculateCartTotal(cart: Cart): Promise<number> {
    let total = 0;
    if (cart.cartItems) {
      for (const cartItem of cart.cartItems) {
        total += cartItem.price * cartItem.quantity;
      }
    }
    return total;
  }
}
