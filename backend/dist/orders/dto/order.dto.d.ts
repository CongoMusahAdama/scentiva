export declare class CreateOrderDto {
    id: string;
    customer: string;
    products: string;
    amount: string;
    status: string;
    date: string;
    phone: string;
    address: string;
}
export declare class UpdateOrderDto extends CreateOrderDto {
}
