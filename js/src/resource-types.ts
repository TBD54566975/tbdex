import type { PresentationDefinitionV2 } from '@sphereon/pex-models'
import type { Schema as JsonSchema } from 'ajv'
import type {TypeID} from 'typeid-js'

export type { PresentationDefinitionV2, JsonSchema }

export type ResourceType<R extends keyof ResourceTypes> = ResourceTypes[R]

export type ResourceTypes = {
  offering: Offering
}

export type TbdexResource<R extends keyof ResourceTypes> = ResourceType<R>

export type Offering = {
  id: TypeID<'offering'>
  description: string
  quoteUnitsPerBaseUnit: string
  baseCurrency: CurrencyDetails
  quoteCurrency: CurrencyDetails
  vcRequirements: PresentationDefinitionV2
  payinMethods: PaymentMethod[]
  payoutMethods: PaymentMethod[]
  createdTime: string
}

export interface PaymentMethod {
  // valid kind strings: 'CASHAPP_PAY', 'APPLE_PAY', 'BTC_ADDRESS'
  kind: string
  requiredPaymentDetails?: JsonSchema
  feeSubunits?: string
}

export type CurrencyDetails = {
  currencyCode: string
  minSubunits?: string
  maxSubunits?: string
}