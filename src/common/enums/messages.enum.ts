export enum AuthMessage {
  NotFoundAccount = 'User account not found',
  TryAgain = 'Please try again',
  AlreadyExistAccount = 'An account with these details already exists',
  ExpiredCode = 'Verification code expired, please try again',
  LoginAgain = 'Please log in again',
  LoginIsRequired = 'Please log in to your account',
  Blocked = 'Your account is blocked, please contact support',
}

export enum ColorsMessage {
  CreatedColorSuccess = 'Color created successfully',
  AlreadyExistsColor = 'A color with this name already exists',
  NotFoundColor = 'Color not found',
  UpdatedColorSuccess = 'Color updated successfully',
  CannotUpdateColor = 'You are not allowed to update this color',
  CannotRemoveColor = 'You are not allowed to remove this color',
  RemoveColorSuccess = 'Color removed successfully',
}

export enum CategoriesMessage {
  CreatedCategorySuccess = 'Category created successfully',
  AlreadyExistsCategory = 'A category with this name already exists',
  NotFoundCategory = 'Category not found',
  UpdatedCategorySuccess = 'Category updated successfully',
  CannotUpdateCategory = 'You are not allowed to update this category',
  CannotRemoveCategory = 'You are not allowed to remove this category',
  RemoveCategorySuccess = 'Category removed successfully',
}

export enum StoresMessage {
  CreatedStoreSuccess = 'Store created successfully',
  AlreadyExistsStore = 'A store with this name already exists',
  NotFoundStore = 'Store not found',
  UpdatedStoreSuccess = 'Store updated successfully',
  CannotUpdateStore = 'You are not allowed to update this store',
  CannotRemoveStore = 'You are not allowed to remove this store',
  RemoveStoreSuccess = 'Store removed successfully',
}
export enum SellersMessage {
  CreatedSellerSuccess = 'Seller created successfully',
  AlreadyExistsSeller = 'A seller with this name already exists',
  NotFoundSeller = 'Seller not found',
  UpdatedSellerSuccess = 'Seller updated successfully',
  CannotUpdateSeller = 'You are not allowed to update this seller',
  CannotRemoveSeller = 'You are not allowed to remove this seller',
  RemoveSellerSuccess = 'Seller removed successfully',
}
export enum ProductsMessage {
  CreatedProductSuccess = 'Product created successfully',
  CreateProductSettingsSuccess = 'Product settings created successfully',
  SaleExceedsStock = 'Sale quantity exceeds available stock',
  UpdateProductSettingsSuccess = 'Product settings updated successfully',
  AlreadyExistsProduct = 'A product with this name already exists',
  NotFoundProduct = 'Product not found',
  UpdatedProductSuccess = 'Product updated successfully',
  CannotUpdateProduct = 'You are not allowed to update this product',
  CannotRemoveProduct = 'You are not allowed to remove this product',
  RemoveProductSuccess = 'Product removed successfully',
  FailedCreateProduct = 'Failed to create product',
}
export enum TransactionsMessage {
  CreatedTransactionSuccess = 'Transaction created successfully',
  UpdatedTransactionSuccess = 'Transaction updated successfully',
  RemoveTransactionSuccess = 'Transaction removed successfully',
}
