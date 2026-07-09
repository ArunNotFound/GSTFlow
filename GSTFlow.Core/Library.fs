namespace GSTFlow.Core

type StateCode = string
type GSTIN = string

type Party = {
    Gstin: GSTIN
    StateCode: StateCode
}

type SupplyType =
    | B2B
    | B2C

type TaxAmount = {
    Igst: decimal
    Cgst: decimal
    Sgst: decimal
}

type InvoiceItem = {
    Hsn: string
    TaxableValue: decimal
    GstRate: decimal
    Tax: TaxAmount
}

type Invoice = {
    InvoiceNumber: string
    InvoiceDate: string
    Seller: Party
    Buyer: Party option
    Items: InvoiceItem list
}

type GSTCanonicalIR = {
    Invoice: Invoice
    DerivedSupplyType: SupplyType
    PlaceOfSupply: StateCode
    IsInterstate: bool
}
