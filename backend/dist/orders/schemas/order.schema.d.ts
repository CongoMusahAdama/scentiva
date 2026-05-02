import { Document } from 'mongoose';
export declare class Order extends Document {
    id: string;
    customer: string;
    products: string;
    amount: string;
    status: string;
    date: string;
    phone: string;
    address: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, any, any, Order>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    id?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    products?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Order, Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }> | undefined;
}, Order>;
