$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Save-CroppedTransparentPng {
  param(
    [string]$Source,
    [string]$Destination,
    [int]$CanvasSize = 384,
    [int]$Padding = 18
  )

  $image = [System.Drawing.Bitmap]::FromFile($Source)
  try {
    $minX = $image.Width
    $minY = $image.Height
    $maxX = -1
    $maxY = -1

    for ($y = 0; $y -lt $image.Height; $y++) {
      for ($x = 0; $x -lt $image.Width; $x++) {
        if ($image.GetPixel($x, $y).A -gt 0) {
          if ($x -lt $minX) { $minX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -gt $maxY) { $maxY = $y }
        }
      }
    }

    if ($maxX -lt 0 -or $maxY -lt 0) {
      throw "No visible pixels in $Source"
    }

    $cropX = [Math]::Max(0, $minX - 2)
    $cropY = [Math]::Max(0, $minY - 2)
    $cropWidth = [Math]::Min($image.Width - $cropX, ($maxX - $minX + 1) + 4)
    $cropHeight = [Math]::Min($image.Height - $cropY, ($maxY - $minY + 1) + 4)

    $targetSize = $CanvasSize - ($Padding * 2)
    $scale = [Math]::Min($targetSize / $cropWidth, $targetSize / $cropHeight)
    $drawWidth = [int][Math]::Round($cropWidth * $scale)
    $drawHeight = [int][Math]::Round($cropHeight * $scale)
    $drawX = [int][Math]::Round(($CanvasSize - $drawWidth) / 2)
    $drawY = [int][Math]::Round(($CanvasSize - $drawHeight) / 2)

    $bitmap = New-Object System.Drawing.Bitmap $CanvasSize, $CanvasSize
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.Clear([System.Drawing.Color]::Transparent)

      $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropWidth, $cropHeight
      $dstRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight
      $graphics.DrawImage($image, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

      $tempFile = "$Destination.tmp.png"
      if (Test-Path $tempFile) {
        Remove-Item -Force $tempFile
      }

      $bitmap.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
      Move-Item -Force $tempFile $Destination
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

$sourceDir = 'D:\EvanCodex\eat\tmp_unit_new_check'
$destinationDir = 'D:\EvanCodex\eat\miniprogram\assets\result-units'

$sourceFiles = Get-ChildItem $sourceDir -File | Sort-Object Name
$destinationNames = @(
  'bucket.png',
  'rice-cooker.png',
  'salt-bag.png',
  'salt-sack.png',
  'bowl.png',
  'salt-box.png'
)

if ($sourceFiles.Count -ne $destinationNames.Count) {
  throw "Unexpected source file count: $($sourceFiles.Count)"
}

for ($i = 0; $i -lt $destinationNames.Count; $i++) {
  $source = $sourceFiles[$i].FullName
  $destination = Join-Path $destinationDir $destinationNames[$i]
  Save-CroppedTransparentPng -Source $source -Destination $destination
}

Get-ChildItem $destinationDir -File |
  Sort-Object Length -Descending |
  Select-Object Name, @{ Name = 'KB'; Expression = { [math]::Round($_.Length / 1KB, 1) } }
