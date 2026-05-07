$appPath = ".\app"
$bailamPath = ".\components\bailam"
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False

$files = Get-ChildItem -Path $bailamPath -File | Where-Object { $_.Name -match "_" }

foreach ($file in $files) {
    $oldName = $file.BaseName
    $newName = $oldName -replace "_", "-"
    
    Write-Host "Renaming $($file.Name) to $($newName + $file.Extension)"
    Rename-Item -Path $file.FullName -NewName ($newName + $file.Extension)
    
    Get-ChildItem -Path $appPath -Recurse -Filter "*.js" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $searchStr = "components/bailam/$oldName"
        $replaceStr = "components/bailam/$newName"
        
        if ($content.Contains($searchStr)) {
            Write-Host "Updating imports in $($_.FullName)"
            $newContent = $content.Replace($searchStr, $replaceStr)
            [IO.File]::WriteAllText($_.FullName, $newContent, $Utf8NoBomEncoding)
        }
    }
}
