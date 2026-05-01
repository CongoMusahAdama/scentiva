import { Document } from 'mongoose';
export declare class SmsLog extends Document {
    recipient: string;
    message: string;
    status: string;
    providerResponse: string;
    eventType: string;
    referenceId: string;
}
export declare const SmsLogSchema: import("mongoose").Schema<SmsLog, import("mongoose").Model<SmsLog, any, any, any, any, any, SmsLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SmsLog, Document<unknown, {}, SmsLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recipient?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerResponse?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    referenceId?: import("mongoose").SchemaDefinitionProperty<string, SmsLog, Document<unknown, {}, SmsLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SmsLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SmsLog>;
