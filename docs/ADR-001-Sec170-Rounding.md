# ADR 001: Section 170 Rounding Interpretation

## Context
During the G4 Launch Gate (Validating a Real Invoice), we passed `invoice-1.pdf` (a real B2C Amazon retail invoice) through the native `GSTFlow.Cli` rules engine.

The invoice had the following math:
- Taxable Value: ₹13,974.58
- CGST (9%): ₹1,257.71
- SGST (9%): ₹1,257.71
- Total Tax: ₹2,515.42
- Final Total: ₹16,490.00

Our original implementation of the Section 170 CGST Act rule (`SEC_170_ROUNDING`) strictly enforced that the **tax amounts** themselves must be rounded off to the nearest Rupee. Because Amazon emitted fractional taxes (1257.71), the engine blocked the invoice.

## Learning
While the strict letter of Section 170 ("The tax assessed... shall be rounded off to the nearest rupee") implies that tax components should be integers, massive enterprise ERPs like Amazon interpret this practically: they retain fractional precision for item-level tax lines and only round the **Final Invoice Total** to the nearest Rupee (13974.58 + 2515.42 = 16490.00 perfectly). 

If we strictly block fractional tax fields, GSTFlow will yield false-positive rejections against a vast swath of India's retail economy.

## Decision
We demoted the strict tax-field rounding check. The `SEC_170_ROUNDING` rule now only fires if the **Final Invoice Total** (TaxableValue + Total Tax) is not an integer. We accept fractional tax fields as long as the math aligns and the final consumer pays a rounded Rupee amount.

## Status
Accepted and Implemented.
