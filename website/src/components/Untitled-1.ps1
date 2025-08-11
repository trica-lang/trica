$componentsPath = Join-Path (Get-Location) "src\components"

if (-Not (Test-Path $componentsPath)) {
    Write-Error "Directory 'src/components' not found!"
    exit 1
}

Get-ChildItem -Path $componentsPath -Filter *.js -Recurse | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file

    $changed = $false
    $newContent = foreach ($line in $content) {

        # Fix bad imports with backslashes like import\ \{\ FaAdjust\ }\ from\ 'react-icons/fa';
        if ($line -match "import\\s*\\{\\s*FaAdjust\\s*\\}\\s*from\\s*'react-icons/fa';") {
            $changed = $true
            "import { FaAdjust } from 'react-icons/fa';"
            continue
        }

        # Replace react-icons/fi import lines with react-icons/fa, changing icon names
        if ($line -match "^import\s+\{.*\}\s+from\s+'react-icons/fi';") {
            $changed = $true
            # Map Fi icons to Fa icons
            $fiToFaMap = @{
                "FiBook" = "FaBook"
                "FiCode" = "FaCode"
                "FiZap" = "FaBolt"
                "FiSettings" = "FaCog"
            }
            # Extract icons inside braces
            $icons = ($line -replace "^import\s+\{|\}\s+from\s+'react-icons/fi';", "") -split ","
            $icons = $icons | ForEach-Object { $_.Trim() }

            # Map icons
            $mappedIcons = $icons | ForEach-Object {
                if ($fiToFaMap.ContainsKey($_)) { $fiToFaMap[$_] } else { $_ }
            }

            "import { $($mappedIcons -join ', ') } from 'react-icons/fa';"
            continue
        }

        # Normal line, keep it
        $line
    }

    if ($changed) {
        # Overwrite file with fixed content
        Set-Content -Path $file -Value $newContent -Encoding UTF8
        Write-Host "Fixed imports in $file"
    } else {
        Write-Host "No changes needed in $file"
    }
}
