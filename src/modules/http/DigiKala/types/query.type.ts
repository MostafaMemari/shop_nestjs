type ShippingType = 'digikala' | 'seller';
type OrderStatus = 'confirmed' | 'warehouse' | 'warehouse_processing';
type BooleanNumber = 0 | 1;
type StringNumber = string | number;
type PageSize = 10 | 30 | 50 | 100;

export interface VariantsType {
  'search[id]'?: StringNumber;
  'search[product_id]'?: StringNumber;
  'search[category_ids]'?: string;
  'search[brand_ids]'?: string;
  'search[has_warehouse_stock]'?: BooleanNumber;
  'search[shipping_type]'?: ShippingType;
  'search[is_active]'?: BooleanNumber;
  'search[is_archived]'?: BooleanNumber;
  'search[is_buy_box_winner]'?: BooleanNumber;
  'search[is_in_promotion]'?: BooleanNumber;
  'search[is_in_competition]'?: BooleanNumber;
  'search[supplier_code]'?: string;
  'search[active_b2b]'?: BooleanNumber;

  size?: PageSize;
  page?: StringNumber;
}

export interface OrdersType {
  'search[order_ids]'?: StringNumber;
  'search[variant_ids]'?: StringNumber;
  'search[shipping_type]'?: ShippingType;
  'search[product_id]'?: StringNumber;
  'search[category_id]'?: StringNumber;
  'search[supplier_code]'?: StringNumber;
  'search[shipping_nature_ids]'?: StringNumber;
  'search[order_status]'?: OrderStatus;

  size?: PageSize;
  page?: StringNumber;
}
