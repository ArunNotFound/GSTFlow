        echo "Testing Fixture 1 (Valid Interstate B2B)"
        dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_1_intrastate_b2b.json || exit 1

        echo "Testing Fixture 2 (Valid Intrastate B2C)"
        dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_2_intrastate_b2c.json || exit 1

        echo "Testing Fixture 3 (Falsifier - expected to fail with IGST_CGST_LAW)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_3_falsifier.json > out3.log 2>&1; then
            echo "Expected fixture 3 to fail!"
            exit 1
        fi
        grep "\[IGST_CGST_LAW\]" out3.log || { echo "IGST_CGST_LAW violation not found"; exit 1; }

        echo "Testing Fixture 4 (Bad GSTIN Checksum)"
        if dotnet run --project GSTFlow.Cli/GSTFlow.Cli.fsproj -- --validate fixtures/fixture_4_bad_check_character.json > out4.log 2>&1; then
            echo "Expected fixture 4 to fail!"
            exit 1
        fi
        grep "\[GSTIN_FORMAT\]" out4.log || { echo "GSTIN_FORMAT violation not found"; exit 1; }
