let charToValue (c: char) =
    let ci = int c
    if ci >= 48 && ci <= 57 then ci - 48
    elif ci >= 65 && ci <= 90 then ci - 65 + 10
    elif ci >= 97 && ci <= 122 then ci - 97 + 10
    else failwith "Invalid character"

let valueToChar (v: int) =
    if v < 10 then char (v + int '0')
    else char (v - 10 + int 'A')

let calculateCheckDigit (gstinWithoutCheck: string) =
    let sum =
        gstinWithoutCheck.ToCharArray()
        |> Array.mapi (fun i c ->
            let value = charToValue c
            let product = value * (if i % 2 = 0 then 1 else 2)
            (product / 36) + (product % 36))
        |> Array.sum
    let remainder = sum % 36
    let checkDigitValue = if remainder = 0 then 0 else 36 - remainder
    valueToChar checkDigitValue

printfn "Correct check digit for 29AAGCB7383J1Z is: %c" (calculateCheckDigit "29AAGCB7383J1Z")
