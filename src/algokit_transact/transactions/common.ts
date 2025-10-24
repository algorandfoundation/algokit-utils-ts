export enum TransactionValidationErrorType {
  RequiredField,
  FieldTooLong,
  ImmutableField,
  ZeroValueField,
  ArbitraryConstraint,
}

export type TransactionValidationError =
  | RequiredFieldValidationError
  | FieldTooLongValidationError
  | ImmutableFieldValidationError
  | ZeroValueFieldValidationError
  | ArbitraryConstraintValidationError

type RequiredFieldValidationError = {
  type: TransactionValidationErrorType.RequiredField
  data: string
}

type FieldTooLongValidationError = {
  type: TransactionValidationErrorType.FieldTooLong
  data: {
    field: string
    actual: number
    max: number
    unit: string
  }
}

type ImmutableFieldValidationError = {
  type: TransactionValidationErrorType.ImmutableField
  data: string
}

type ZeroValueFieldValidationError = {
  type: TransactionValidationErrorType.ZeroValueField
  data: string
}

type ArbitraryConstraintValidationError = {
  type: TransactionValidationErrorType.ArbitraryConstraint
  data: string
}

export function getValidationErrorMessage(validationError: TransactionValidationError): string {
  switch (validationError.type) {
    case TransactionValidationErrorType.RequiredField:
      return `${validationError.data} is required`
    case TransactionValidationErrorType.FieldTooLong:
      return `${validationError.data.field} cannot exceed ${validationError.data.max} ${validationError.data.unit}, got ${validationError.data.actual}`
    case TransactionValidationErrorType.ImmutableField:
      return `${validationError.data} is immutable and cannot be changed`
    case TransactionValidationErrorType.ZeroValueField:
      return `${validationError.data} must not be 0`
    case TransactionValidationErrorType.ArbitraryConstraint:
      return validationError.data
  }
}
