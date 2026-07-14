namespace GSTFlow.UI

open System
open Avalonia
open Avalonia.Controls
open Avalonia.Layout
open Avalonia.Media
open GSTFlow.Core
open GSTFlow.Core.Verification
open GSTFlow.Rules

type MainWindow() as this =
    inherit Window()

    do
        this.Title <- "GSTFlow Pro — 128-Bit Exact Math & Air-Gapped Audit Engine (ADIMURAI)"
        this.Width <- 1100.0
        this.Height <- 750.0
        this.Background <- SolidColorBrush(Color.Parse("#0F172A")) // Premium dark slate

        let rootPanel = DockPanel(Margin = Thickness(24.0))

        // Top Header
        let headerBox = StackPanel(Orientation = Orientation.Vertical, Margin = Thickness(0.0, 0.0, 0.0, 20.0))
        let titleBlock =
            TextBlock(
                Text = "GSTFlow Pro • Desktop & Mobile Inspector (Operation ADIMURAI)",
                FontSize = 26.0,
                FontWeight = FontWeight.Bold,
                Foreground = SolidColorBrush(Color.Parse("#38BDF8"))
            )
        let subtitleBlock =
            TextBlock(
                Text = "100% Offline Statutory Preflight Engine • True 128-Bit Exact Math (System.Decimal) • Zero Float Drift",
                FontSize = 14.0,
                Foreground = SolidColorBrush(Color.Parse("#94A3B8"))
            )
        headerBox.Children.Add(titleBlock)
        headerBox.Children.Add(subtitleBlock)
        DockPanel.SetDock(headerBox, Dock.Top)
        rootPanel.Children.Add(headerBox)

        // Main Content Area
        let mainGrid = Grid()
        mainGrid.ColumnDefinitions.Add(ColumnDefinition(Width = GridLength(1.0, GridUnitType.Star)))
        mainGrid.ColumnDefinitions.Add(ColumnDefinition(Width = GridLength(20.0, GridUnitType.Pixel)))
        mainGrid.ColumnDefinitions.Add(ColumnDefinition(Width = GridLength(1.3, GridUnitType.Star)))

        // Left Controls Panel
        let leftCard = Border(
            Background = SolidColorBrush(Color.Parse("#1E293B")),
            CornerRadius = CornerRadius(12.0),
            Padding = Thickness(20.0)
        )
        let leftStack = StackPanel(Spacing = 16.0)

        let invoiceLabel = TextBlock(
            Text = "Statutory Audit Controls",
            FontSize = 18.0,
            FontWeight = FontWeight.SemiBold,
            Foreground = SolidColorBrush(Color.Parse("#F8FAFC"))
        )
        leftStack.Children.Add(invoiceLabel)

        let inspectBtn = Button(
            Content = "Run 128-Bit Exact Statutory Audit (INV-2026-8842)",
            Padding = Thickness(16.0, 12.0),
            Background = SolidColorBrush(Color.Parse("#0284C7")),
            Foreground = SolidColorBrush(Colors.White),
            FontWeight = FontWeight.Bold,
            CornerRadius = CornerRadius(8.0)
        )
        leftStack.Children.Add(inspectBtn)

        let statusBadge = TextBlock(
            Text = "STATUS: AWAITING EXECUTION",
            FontSize = 15.0,
            FontWeight = FontWeight.Bold,
            Foreground = SolidColorBrush(Color.Parse("#CBD5E1")),
            Margin = Thickness(0.0, 10.0, 0.0, 0.0)
        )
        leftStack.Children.Add(statusBadge)

        leftCard.Child <- leftStack
        Grid.SetColumn(leftCard, 0)
        mainGrid.Children.Add(leftCard)

        // Right Results Panel
        let rightCard = Border(
            Background = SolidColorBrush(Color.Parse("#1E293B")),
            CornerRadius = CornerRadius(12.0),
            Padding = Thickness(20.0)
        )
        let resultsBox = TextBox(
            IsReadOnly = true,
            AcceptsReturn = true,
            TextWrapping = TextWrapping.Wrap,
            Background = SolidColorBrush(Color.Parse("#0F172A")),
            Foreground = SolidColorBrush(Color.Parse("#34D399")),
            FontFamily = FontFamily("Consolas, Monospace"),
            FontSize = 13.0,
            BorderThickness = Thickness(0.0),
            Text = "Ready to inspect invoices using Pure F# Kernel (GSTFlow.Rules)..."
        )
        rightCard.Child <- resultsBox
        Grid.SetColumn(rightCard, 2)
        mainGrid.Children.Add(rightCard)

        rootPanel.Children.Add(mainGrid)
        this.Content <- rootPanel

        // Event handler to execute 128-bit exact decimal calculation against F# kernel
        inspectBtn.Click.Add(fun _ ->
            let sampleSeller : RawParty = {
                Gstin = "29AAACR5055K1Z5"
                StateCode = "29"
                IsSez = Some false
            }
            let sampleBuyer : RawParty = {
                Gstin = "27AAACT8814B1Z2"
                StateCode = "27"
                IsSez = Some false
            }
            let sampleTax : TaxAmount = {
                Igst = 45000.0m
                Cgst = 0.0m
                Sgst = 0.0m
                Cess = None
            }
            let sampleItem : RawInvoiceItem = {
                Hsn = "84713010"
                TaxableValue = 250000.0m
                GstRate = 18.0m
                CessRate = None
                Tax = sampleTax
            }
            let rawInvoice : RawInvoice = {
                DocumentType = Some "INV"
                InvoiceNumber = "INV-2026-8842"
                InvoiceDate = "2026-07-10"
                PlaceOfSupply = Some "27"
                OriginalInvoiceNumber = None
                OriginalInvoiceDate = None
                Irn = Some "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
                ReverseCharge = Some "N"
                Seller = sampleSeller
                Buyer = Some sampleBuyer
                Items = [ sampleItem ]
            }

            let compResult = Compiler.compile rawInvoice "ADIMURAI-SHA256-SEAL-8842"
            let env = compResult.Envelope
            match env.OverallOutcome with
            | RuleOutcome.Pass ->
                statusBadge.Text <- "STATUS: PASSED (100% STATUTORY COMPLIANCE)"
                statusBadge.Foreground <- SolidColorBrush(Color.Parse("#34D399"))
            | RuleOutcome.Warning ->
                statusBadge.Text <- "STATUS: WARNING (CHECK LINE ITEMS)"
                statusBadge.Foreground <- SolidColorBrush(Color.Parse("#FBBF24"))
            | _ ->
                statusBadge.Text <- "STATUS: FAILED STATUTORY RULES"
                statusBadge.Foreground <- SolidColorBrush(Color.Parse("#F87171"))

            let lines = [
                sprintf "=== OPERATION ADIMURAI • STATUTORY PREFLIGHT REPORT ==="
                sprintf "Invoice Number : %s" rawInvoice.InvoiceNumber
                sprintf "Subject Hash   : %s" env.SubjectHash
                sprintf "Overall Verdict: %A" env.OverallOutcome
                sprintf "Engine Version : %s (%s)" env.EngineId env.EngineVersion
                sprintf "Runtime Math   : 128-Bit Exact System.Decimal (Zero Float Drift)"
                sprintf "-------------------------------------------------------"
                sprintf "Rule Evaluations (%d total rules executed):" env.Results.Length
            ]
            let ruleLines =
                env.Results
                |> List.map (fun r ->
                    sprintf " [%s] Outcome: %A -> Key: %s" r.Metadata.RuleId r.Outcome r.Metadata.MessageKey)
            resultsBox.Text <- String.Join("\n", lines @ ruleLines)
        )
