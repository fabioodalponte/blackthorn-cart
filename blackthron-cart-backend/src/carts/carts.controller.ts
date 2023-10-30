import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Post()
  async createCart(@Body() createCart: Cart): Promise<Cart> {
    return this.cartService.createCart(createCart);
  }

  @Get(':id')
  async getCartById(@Param('id') id: number): Promise<Cart | undefined> {
    return this.cartService.getCartById(id);
  }

  @Put(':id/add-item/:itemId')
  async addItemToCart(
    @Param('id') cartId: number,
    @Param('itemId') itemId: number,
    @Body('quantity') quantity: number,
  ): Promise<Cart> {
    return this.cartService.addItemToCart(cartId, itemId, quantity);
  }

  @Put(':id/remove-item/:cartItemId')
  async removeItemFromCart(
    @Param('id') cartId: number,
    @Param('cartItemId') cartItemId: number,
  ): Promise<void> {
    return this.cartService.removeItemFromCart(cartId, cartItemId);
  }
}
