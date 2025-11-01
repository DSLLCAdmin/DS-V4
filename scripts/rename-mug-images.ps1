# PowerShell script to rename Streeter Mug images for carousel
# Run this from the project root directory

$imagePath = "public/product-images"

Write-Host "`n📸 Renaming Streeter Mug Images for Carousel`n" -ForegroundColor Cyan

# Rename images 0-3
$renames = @(
    @{ From = "Streeter-Mug-0.png"; To = "H6_streeter-mug-0.jpg"; Note = "View 0" }
    @{ From = "Streeter-Mug_1.jpg"; To = "H6_streeter-mug-1.jpg"; Note = "View 1" }
    @{ From = "Streeter-Mug_2.jpg"; To = "H6_streeter-mug-2.jpg"; Note = "View 2 (HOME IMAGE)" }
    @{ From = "Streeter-Mug_3.jpg"; To = "H6_streeter-mug-3.jpg"; Note = "View 3" }
)

foreach ($rename in $renames) {
    $fromPath = Join-Path $imagePath $rename.From
    $toPath = Join-Path $imagePath $rename.To
    
    if (Test-Path $fromPath) {
        # If source is PNG and destination is JPG, need to convert
        if ($rename.From.EndsWith(".png") -and $rename.To.EndsWith(".jpg")) {
            Write-Host "⚠️  WARNING: $($rename.From) is PNG but needs to be JPG" -ForegroundColor Yellow
            Write-Host "   Please convert manually or use Streeter-Mug.jpg if available`n" -ForegroundColor Yellow
        } else {
            try {
                Rename-Item -Path $fromPath -NewName $rename.To -Force
                Write-Host "✅ Renamed: $($rename.From) → $($rename.To) ($($rename.Note))" -ForegroundColor Green
            } catch {
                Write-Host "❌ Error renaming $($rename.From): $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "⚠️  File not found: $($rename.From)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Done! Verify all 4 images exist:`n" -ForegroundColor Cyan
Get-ChildItem "$imagePath/H6_streeter-mug-*.jpg" | Select-Object Name, Length | Format-Table -AutoSize

Write-Host ""
Write-Host "💡 If H6_streeter-mug-0.jpg is missing (PNG conversion needed):" -ForegroundColor Yellow
Write-Host "   Option 1: Convert Streeter-Mug-0.png to JPG manually" -ForegroundColor White
Write-Host '   Option 2: Use Streeter-Mug.jpg as image 2 if better than Streeter-Mug_2.jpg' -ForegroundColor White
Write-Host ""

