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
    console.log('createCart', createCart);
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
    
    let cart = await this.getCartById(cartId);
    if (!cart) {
      cart = this.cartRepository.create({ id: cartId });
      await this.cartRepository.save(cart);
    }

    const item = await this.validateItemAndStock(itemId, quantity);

    let cartItem = await this.cartItemService.findCartItemByCartAndItem(cart.id, item.id);

    if(cartItem){
      cartItem.quantity += quantity;
      cartItem.price = item.price;
      await this.cartItemService.update(cartItem);
    } else {
      cartItem = await this.cartItemService.createCartItem({
        cart,
        item,
        quantity,
        price: item.price,
      });
      await this.cartItemService.save(cartItem);
    }
    console.log('addItemToCart', cartItem);
    

    if (!cart.cartItems) {
      cart.cartItems = [];
    }

    cart.cartItems.push(cartItem);

    cart.subtotal = await this.calculateCartSubTotal(cart);
    cart.total = await this.calculateCartTotal(cart);

    item.stockAmount = item.stockAmount - quantity;
    await this.itemsService.updateItem(item.id, item);

    return this.cartRepository.save(cart);
  }
  
  calculateCartTotal(cart: Cart): number | PromiseLike<number> {
    console.log('calculateCartTotal', cart.subtotal, cart.taxes, cart.discounts);
    cart.total = cart.subtotal + cart.taxes - cart.discounts;
    return cart.total;
  }

  private async validateItemAndStock(itemId: number, quantity: number) {
    const item = await this.itemsService.findItemById(itemId);

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    if (item.stockAmount < 1 || item.stockAmount < quantity) {
      throw new NotFoundException(`Item ${item.name} out of stock`);
    }
    return item;
  }

  async calculateCartSubTotal(cart: Cart): Promise<number> {
    let subTotal = 0;
    if (cart.cartItems) {
      for (const cartItem of cart.cartItems) {
        subTotal += cartItem.price * cartItem.quantity;
        console.log('calculateCartSubTotal', subTotal);
      }
    }
    return subTotal;
  }
}
