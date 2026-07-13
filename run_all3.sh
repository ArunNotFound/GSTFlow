        echo "Testing Fixture 8 (Valid RCM)"
        dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_8_rcm.json || { echo "Expected fixture 8 to pass!"; exit 1; }

        echo "Testing Fixture 9 (Bad RCM)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_9_rcm_bad.json > out9.log 2>&1; then
            echo "Expected fixture 9 to fail!"
            exit 1
        fi
        grep "\[RCM_TAX_CHARGED\]" out9.log || { echo "RCM_TAX_CHARGED violation not found"; exit 1; }

        echo "Testing Invoice 1 (Real)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/invoice_1_real.json > out_inv1.log 2>&1; then
            echo "Expected invoice 1 to fail!"
            exit 1
        fi
        grep "\[TAX_AMOUNT\]" out_inv1.log || { echo "TAX_AMOUNT violation not found"; exit 1; }

        echo "Testing Invoice 2 (Real)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/invoice_2_real.json > out_inv2.log 2>&1; then
            echo "Expected invoice 2 to fail!"
            exit 1
        fi
        grep "\[IGST_CGST_LAW\]" out_inv2.log || { echo "IGST_CGST_LAW violation not found"; exit 1; }

        echo "Testing Invoice 3 (Real)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/invoice_3_real.json > out_inv3.log 2>&1; then
            echo "Expected invoice 3 to fail!"
            exit 1
        fi
        grep "\[SEC_170_ROUNDING\]" out_inv3.log || { echo "SEC_170_ROUNDING violation not found"; exit 1; }

        echo "Testing Invoice 4 (Real)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/invoice_4_real.json > out_inv4.log 2>&1; then
            echo "Expected invoice 4 to fail!"
            exit 1
        fi
        grep "\[SEC_170_ROUNDING\]" out_inv4.log || { echo "SEC_170_ROUNDING violation not found"; exit 1; }

        echo "Testing Invoice 5 (SaaS)"
        dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/invoice_5_saas.json || { echo "Expected invoice 5 to pass!"; exit 1; }
