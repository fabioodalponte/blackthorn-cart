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

  async getCartById(id: number): Promise<Cart> {
    return this.cartRepository.findOne({ where: { id }, relations: { cartItems: true } });
  }

  async removeItemFromCart(cartId: number, itemId: number): Promise<void> {
    const cart = await this.getCartById(cartId);
    const cartItem = await this.cartItemService.findCartItemByCartAndItem(cart.id, itemId);
    if (!cartItem) {
      throw new NotFoundException(`Item ${itemId} not found in cart ${cartId}`);
    }
    
    const totalCartItem = (cartItem.quantity * cartItem.price);
    await this.cartItemService.deleteCartItem(cartItem.id);

    this.cartRepository.update(cart.id, { total: (cart.total - totalCartItem), subtotal: (cart.subtotal-totalCartItem)});
  }

  async addItemToCart(
    cartId: number,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    
    let cart = await this.getCartById(cartId);
    if (!cart) {
      this.createCart(new Cart({ id: cartId }));
    }

    const item = await this.validateItemAndStock(itemId, quantity);

    let cartItem = await this.cartItemService.findCartItemByCartAndItem(cart.id, item.id);

    if(cartItem){
      cartItem.quantity += quantity;
      cartItem.price = item.price;
      cart.cartItems.find(val => val.id == cartItem.id);
    } else {
      cartItem = await this.cartItemService.createCartItem({
        cart,
        item,
        quantity,
        price: item.price,
      });
    }
    await this.cartItemService.save(cartItem);

    item.stockAmount = item.stockAmount - quantity;
  
    await this.itemsService.updateItem(item.id, item);

     if (!cart.cartItems) {
       cart.cartItems = [];
     }

     const itemIndex = cart.cartItems.findIndex(val => val.id === cartItem.id);

     if (itemIndex !== -1) {
      // Override the cartItem
      cart.cartItems[itemIndex] = cartItem;
    } else {
      // Add the new cartItem
      cart.cartItems.push(cartItem);
    }

    cart.subtotal = await this.calculateCartSubTotal(cart);
    cart.total = await this.calculateCartTotal(cart);

    return this.cartRepository.save(cart);
  }
  
  calculateCartTotal(cart: Cart): number | PromiseLike<number> {
    cart.total = Number(cart.subtotal) + Number(cart.taxes) - Number(cart.discounts);
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
      }
    }
    return subTotal;
  }
}
