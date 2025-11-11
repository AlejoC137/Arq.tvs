# Script para convertir todos los archivos .docx a .md
# Requiere Pandoc instalado: https://pandoc.org/installing.html

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Convertidor DOCX a Markdown" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Pandoc está instalado
try {
    $pandocVersion = pandoc --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Pandoc no encontrado"
    }
    Write-Host "✓ Pandoc detectado" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Pandoc no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala Pandoc desde:" -ForegroundColor Yellow
    Write-Host "https://pandoc.org/installing.html" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Obtener todos los archivos .docx
$docxFiles = Get-ChildItem -Filter "*.docx" -File

if ($docxFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos .docx en este directorio" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 0
}

Write-Host "Se encontraron $($docxFiles.Count) archivos .docx para convertir" -ForegroundColor Cyan
Write-Host ""

$convertedCount = 0
$errorCount = 0

foreach ($file in $docxFiles) {
    try {
        # Crear nombre del archivo .md (convertir a formato amigable)
        $baseName = $file.BaseName
        
        # Remover prefijos comunes y limpiar
        $mdFileName = $baseName `
            -replace '^INTERNO ARQ - ', '' `
            -replace '^INTERNO OBRA - ', '' `
            -replace '^PROVEEDORES - ', '' `
            -replace '^CLIENTES - ', '' `
            -replace '\s+', '-' `
            -replace '[^\w\-áéíóúñÁÉÍÓÚÑ]', ''
        
        $mdFileName = $mdFileName.ToLower() + ".md"
        
        # Verificar si ya existe
        if (Test-Path $mdFileName) {
            Write-Host "⚠ Ya existe: $mdFileName" -ForegroundColor Yellow
            $overwrite = Read-Host "¿Sobrescribir? (S/N)"
            if ($overwrite -ne 'S' -and $overwrite -ne 's') {
                Write-Host "  Omitiendo..." -ForegroundColor Gray
                continue
            }
        }
        
        Write-Host "Convirtiendo: $($file.Name)" -ForegroundColor White
        Write-Host "         -> : $mdFileName" -ForegroundColor Gray
        
        # Convertir con Pandoc
        pandoc $file.FullName -o $mdFileName `
            --extract-media=. `
            --wrap=none `
            -f docx `
            -t gfm
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Completado" -ForegroundColor Green
            $convertedCount++
        } else {
            throw "Error en la conversión"
        }
        
    } catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen de Conversión" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total archivos: $($docxFiles.Count)" -ForegroundColor White
Write-Host "Convertidos: $convertedCount" -ForegroundColor Green
Write-Host "Errores: $errorCount" -ForegroundColor Red
Write-Host ""

if ($convertedCount -gt 0) {
    Write-Host "¡Conversión completada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Los archivos .md están listos para usar en la aplicación" -ForegroundColor Cyan
    Write-Host "Puedes revisar y editar los archivos convertidos antes de usarlos" -ForegroundColor Gray
}

Write-Host ""
Read-Host "Presiona Enter para salir"
