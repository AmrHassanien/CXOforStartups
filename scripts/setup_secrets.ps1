# Create GCP Secrets script
# This script creates the necessary secrets in GCP Secret Manager and prompts for their values.

param(
    [string]$ProjectId = $(gcloud config get-value project)
)

$Secrets = @(
    "DATABASE_URL",
    "COOKIE_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD_HASH",
    "GEMINI_API_KEY",
    "FIREBASE_STORAGE_BUCKET"
)

foreach ($Secret in $Secrets) {
    Write-Host "--- Processing Secret: $Secret ---" -ForegroundColor Cyan
    
    # Check if secret exists
    $Exists = gcloud secrets list --filter="name ~ $Secret" --format="value(name)" --project $ProjectId
    
    if (-not $Exists) {
        Write-Host "Creating secret $Secret..."
        gcloud secrets create $Secret --replication-policy="automatic" --project $ProjectId
    } else {
        Write-Host "Secret $Secret already exists."
    }

    # Prompt user for value (if they want to update it)
    $Value = Read-Host "Enter the value for $Secret (leave empty to skip update)"
    if ($Value) {
        # Add a new version with the provided value (standard PowerShell piping)
        $Value | gcloud secrets versions add $Secret --data-file=- --project $ProjectId
        Write-Host "Updated $Secret with a new version." -ForegroundColor Green
    }
}

Write-Host "`nAll secrets processed!" -ForegroundColor Green
