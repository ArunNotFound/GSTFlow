        echo "Testing Fixture 5 (Both IGST and CGST - illegal)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_5_both_taxes.json > out5.log 2>&1; then
            echo "Expected fixture 5 to fail!"
            exit 1
        fi
        grep "\[IGST_CGST_LAW\]" out5.log || { echo "IGST_CGST_LAW violation not found"; exit 1; }

        echo "Testing Fixture 6 (Off Slab)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_6_off_slab.json > out6.log 2>&1; then
            echo "Expected fixture 6 to fail!"
            exit 1
        fi
        grep "\[RATE_SLAB\]" out6.log || { echo "RATE_SLAB violation not found"; exit 1; }

        echo "Testing Fixture 7 (Sanity rules)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_7_sanity.json > out7.log 2>&1; then
            echo "Expected fixture 7 to fail!"
            exit 1
        fi
