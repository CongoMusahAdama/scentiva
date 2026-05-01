export class CreateOrderDto {
  id: string;
  customer: string;
  products: string;
  amount: string;
  status: string;
  date: string;
  phone: string;
  address: string;
}

export class UpdateOrderDto extends CreateOrderDto {}
