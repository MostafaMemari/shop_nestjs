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