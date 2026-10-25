param(
  [Parameter(Mandatory = $true)]
  [string]$WorkbookPath,

  [Parameter(Mandatory = $true)]
  [string]$PhotoRoot,

  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot,

  [string]$ReportPath
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-ZipEntry {
  param(
    [System.IO.Compression.ZipArchive]$Archive,
    [string]$Name
  )

  $entry = $Archive.GetEntry($Name)
  if ($null -eq $entry) {
    throw "Workbook entry not found: $Name"
  }

  $reader = [System.IO.StreamReader]::new($entry.Open())
  try {
    return $reader.ReadToEnd()
  } finally {
    $reader.Dispose()
  }
}

function Get-WorksheetRowValues {
  param(
    [System.Xml.XmlNode]$Row,
    [System.Xml.XmlNamespaceManager]$NamespaceManager,
    [string[]]$SharedStrings
  )

  $values = @{}
  foreach ($cell in $Row.SelectNodes('m:c', $NamespaceManager)) {
    $column = [regex]::Match($cell.r, '^[A-Z]+').Value
    $valueNode = $cell.SelectSingleNode('m:v', $NamespaceManager)
    $value = if ($null -eq $valueNode) { '' } else { $valueNode.InnerText }

    if ($cell.t -eq 's' -and $value -ne '') {
      $value = $SharedStrings[[int]$value]
    } elseif ($cell.t -eq 'inlineStr') {
      $inline = $cell.SelectSingleNode('m:is', $NamespaceManager)
      if ($null -ne $inline) {
        $value = $inline.InnerText
      }
    }

    $values[$column] = $value
  }

  return $values
}

if (-not $ReportPath) {
  $ReportPath = Join-Path $ProjectRoot 'PRODUCT-MATCHING-REPORT.md'
}

$databasePath = Join-Path $ProjectRoot 'backend\database.json'
$publicImageRoot = Join-Path $ProjectRoot 'frontend\public\images\catalog'
$archive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $WorkbookPath))

try {
  [xml]$sharedStringsXml = Read-ZipEntry -Archive $archive -Name 'xl/sharedStrings.xml'
  [xml]$worksheetXml = Read-ZipEntry -Archive $archive -Name 'xl/worksheets/sheet1.xml'
  [xml]$drawingXml = Read-ZipEntry -Archive $archive -Name 'xl/drawings/drawing1.xml'
  [xml]$drawingRelationshipsXml = Read-ZipEntry -Archive $archive -Name 'xl/drawings/_rels/drawing1.xml.rels'

  $worksheetNamespaces = [System.Xml.XmlNamespaceManager]::new($worksheetXml.NameTable)
  $worksheetNamespaces.AddNamespace('m', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')
  $sharedStringNamespaces = [System.Xml.XmlNamespaceManager]::new($sharedStringsXml.NameTable)
  $sharedStringNamespaces.AddNamespace('m', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')

  $sharedStrings = @(
    foreach ($item in $sharedStringsXml.SelectNodes('//m:si', $sharedStringNamespaces)) {
      $item.InnerText
    }
  )

  $worksheetRows = @{}
  foreach ($row in $worksheetXml.SelectNodes('//m:sheetData/m:row', $worksheetNamespaces)) {
    $worksheetRows[[int]$row.r] = Get-WorksheetRowValues -Row $row -NamespaceManager $worksheetNamespaces -SharedStrings $sharedStrings
  }

  $relationshipNamespaces = [System.Xml.XmlNamespaceManager]::new($drawingRelationshipsXml.NameTable)
  $relationshipNamespaces.AddNamespace('r', 'http://schemas.openxmlformats.org/package/2006/relationships')
  $imageTargets = @{}
  foreach ($relationship in $drawingRelationshipsXml.SelectNodes('//r:Relationship', $relationshipNamespaces)) {
    $imageTargets[$relationship.Id] = [System.IO.Path]::GetFileName(($relationship.Target -replace '/', '\'))
  }

  $drawingNamespaces = [System.Xml.XmlNamespaceManager]::new($drawingXml.NameTable)
  $drawingNamespaces.AddNamespace('xdr', 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing')
  $drawingNamespaces.AddNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main')
  $drawingNamespaces.AddNamespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
  $attachedImages = @{}

  foreach ($anchor in $drawingXml.SelectNodes('//xdr:twoCellAnchor | //xdr:oneCellAnchor', $drawingNamespaces)) {
    $fromRow = $anchor.SelectSingleNode('xdr:from/xdr:row', $drawingNamespaces)
    $image = $anchor.SelectSingleNode('.//a:blip', $drawingNamespaces)
    if ($null -eq $fromRow -or $null -eq $image) {
      continue
    }

    $relationshipId = $image.GetAttribute('embed', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
    $attachedImages[[int]$fromRow.InnerText + 1] = $imageTargets[$relationshipId]
  }
} finally {
  $archive.Dispose()
}

$verifiedPhotoFolders = @{
  1 = '1'
  2 = '2'
  3 = '3'
  4 = '4'
  5 = '5'
  6 = '6'
  7 = '18'
  8 = '8'
  9 = '9'
  10 = '10'
}
$primaryImageNames = @{
  8 = 'walkin_exact_design.png'
}
$imageExtensions = @('.jpg', '.jpeg', '.png', '.webp')
$products = @()
$publishedItems = @{}
$reportLines = [System.Collections.Generic.List[string]]::new()

$reportLines.Add('# HOS product matching report')
$reportLines.Add('')
$reportLines.Add("Source workbook: ``$(Split-Path -Leaf $WorkbookPath)``")
$reportLines.Add('')
$reportLines.Add('Only rows with a listed price and a visually verified source-photo folder are published. No sizes, stock levels, ratings, or missing prices were inferred.')
$reportLines.Add('')
$reportLines.Add('| Item | Excel row | Style (raw) | Color (raw) | Price (raw) | Embedded workbook image | Verified photo folder | Storefront photo files | Result |')
$reportLines.Add('|---:|---:|---|---|---:|---|---|---|---|')

for ($excelRow = 3; $excelRow -le 42; $excelRow++) {
  $itemNumber = $excelRow - 2
  $values = $worksheetRows[$excelRow]
  if ($null -eq $values) {
    $values = @{}
  }

  $style = ([string]$values['C']).Trim()
  $rawColor = ([string]$values['D']).Trim()
  $rawPrice = ([string]$values['F']).Trim()
  $styleForReport = if ($style) { $style } else { 'Not listed' }
  $colorForReport = if ($rawColor) { $rawColor } else { 'Not listed' }
  $priceForReport = if ($rawPrice) { $rawPrice } else { 'Not listed' }
  $embeddedImage = if ($attachedImages.ContainsKey($excelRow)) { $attachedImages[$excelRow] } else { 'None found' }
  $photoFolder = 'Not verified'
  $storefrontPhotos = 'None; not published'
  $result = 'Withheld: no price listed'

  if ($rawPrice) {
    $price = [decimal]::Parse($rawPrice, [Globalization.CultureInfo]::InvariantCulture)
    if ($price -gt 0 -and $verifiedPhotoFolders.ContainsKey($itemNumber)) {
      $sourceFolder = Join-Path $PhotoRoot $verifiedPhotoFolders[$itemNumber]
      $sourceImages = @(
        Get-ChildItem -LiteralPath $sourceFolder -File |
          Where-Object { $imageExtensions -contains $_.Extension.ToLowerInvariant() } |
          Sort-Object Name
      )

      if ($sourceImages.Count -eq 0) {
        throw "No supported product images found in verified source folder: $sourceFolder"
      }

      $destinationFolderName = 'item-{0:D2}' -f $itemNumber
      $destinationFolder = Join-Path $publicImageRoot $destinationFolderName
      New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null

      $primaryImageName = $primaryImageNames[$itemNumber]
      if ($primaryImageName) {
        $primaryImage = @($sourceImages | Where-Object Name -eq $primaryImageName)
        if ($primaryImage.Count -ne 1) {
          throw "Configured primary image '$primaryImageName' was not found exactly once in $sourceFolder"
        }
        $sourceImages = @($primaryImage) + @($sourceImages | Where-Object Name -ne $primaryImageName)
      }

      $webImages = @()
      foreach ($sourceImage in $sourceImages) {
        Copy-Item -LiteralPath $sourceImage.FullName -Destination (Join-Path $destinationFolder $sourceImage.Name) -Force
        $webImages += "/images/catalog/$destinationFolderName/$($sourceImage.Name)"
      }
      $storefrontPhotos = ($sourceImages | ForEach-Object { $_.Name }) -join ', '

      $displayColor = if ($rawColor -ieq 'whtie') {
        'White'
      } else {
        [Globalization.CultureInfo]::CurrentCulture.TextInfo.ToTitleCase($rawColor.ToLowerInvariant())
      }
      $displayStyle = if ($style) { $style } else { 'Line Sheet Item {0:D2}' -f $itemNumber }
      $productName = if ($style) { "$style - $displayColor" } else { "$displayStyle - $displayColor" }
      $styleDetail = if ($style) { $style } else { 'Not listed in the workbook' }

      $products += [ordered]@{
        _id = 'hos-line-{0:D2}' -f $itemNumber
        createdAt = [DateTime]::UtcNow.ToString('o')
        updatedAt = [DateTime]::UtcNow.ToString('o')
        name = $productName
        slug = ('line-sheet-item-{0:D2}-{1}' -f $itemNumber, ($displayColor.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-'))
        price = $price
        discount = 0
        images = $webImages
        description = "Line-sheet item $itemNumber. Color: $displayColor. The supplied workbook does not provide sizing or stock information."
        details = "Line-sheet item: $itemNumber`nStyle: $styleDetail`nColor as listed: $rawColor`nPrice as listed: $($price.ToString('0.##', [Globalization.CultureInfo]::InvariantCulture))"
        sizes = @()
        colors = @($displayColor)
        category = 'Co-ords'
        collections = @('New Season', 'New Arrivals')
        occasions = @()
        inventory = $null
        rating = $null
        sku = $style
        bestseller = $false
        newArrival = $true
        featured = $true
      }

      $publishedItems[$itemNumber] = $true
      $photoFolder = "Folder $($verifiedPhotoFolders[$itemNumber]) (high-confidence visual match)"
      $result = 'Published; purchase disabled pending size and stock confirmation'
    } elseif ($price -gt 0) {
      $result = 'Withheld: photo match not verified'
    }
  }

  $escapedStyle = $styleForReport.Replace('|', '\|')
  $escapedColor = $colorForReport.Replace('|', '\|')
  $reportLines.Add("| $itemNumber | $excelRow | $escapedStyle | $escapedColor | $priceForReport | $embeddedImage | $photoFolder | $storefrontPhotos | $result |")
}

$categoryImageSource = Join-Path $PhotoRoot '13\858093683_1112916044873911_8752192377420439912_n.webp'
$categoryImageFolder = Join-Path $publicImageRoot 'category-gowns'
New-Item -ItemType Directory -Path $categoryImageFolder -Force | Out-Null
Copy-Item -LiteralPath $categoryImageSource -Destination (Join-Path $categoryImageFolder (Split-Path -Leaf $categoryImageSource)) -Force

$database = Get-Content -LiteralPath $databasePath -Raw | ConvertFrom-Json
$database.products = @($products)
$databaseJson = ConvertTo-Json -InputObject $database -Depth 100
[System.IO.File]::WriteAllText($databasePath, $databaseJson, [System.Text.UTF8Encoding]::new($false))

$reportLines.Add('')
$reportLines.Add('## Notes')
$reportLines.Add('')
$reportLines.Add('- Raw workbook values are retained in the table. The website corrects the obvious item 4 color typo `whtie` to `White`; no other spellings were changed.')
$reportLines.Add('- Rows without a listed price were not added to the storefront. Rows with a price but no verified photo mapping would also be withheld.')
$reportLines.Add('- The workbook images column was mapped from the actual embedded-image anchors, not inferred from row order.')
$reportLines.Add('- Sizes and inventory are absent from the workbook. Published products cannot be added to the bag until HOS confirms those details.')
$reportLines.Add('- The Gowns category tile uses a visually verified source photo as category artwork only; it is not a published product match.')
[System.IO.File]::WriteAllLines($ReportPath, $reportLines, [System.Text.UTF8Encoding]::new($false))

Write-Output "Published products: $($products.Count)"
Write-Output "Workbook rows reviewed: 40"
Write-Output "Matching report: $ReportPath"
