declare class WhenToApplyDto {
    icon: string;
    label: string;
    detail: string;
}
export declare class CreateProductDto {
    id: string;
    name: string;
    actual: number;
    original: number;
    costPrice?: number;
    tag: string;
    category: string;
    image: string;
    image2?: string;
    desc: string;
    pros: string[];
    cons: string[];
    whenToApply: WhenToApplyDto[];
    perfectOccasion: string;
    status: string;
}
export declare class UpdateProductDto extends CreateProductDto {
}
export {};
