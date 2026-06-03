param(
  [string]$RepoName = $(if ($env:GITHUB_REPO_NAME) { $env:GITHUB_REPO_NAME } else { Split-Path -Leaf (Get-Location) }),
  [string]$Owner = $env:GITHUB_OWNER,
  [ValidateSet("private", "public")]
  [string]$Visibility = $(if ($env:GITHUB_VISIBILITY) { $env:GITHUB_VISIBILITY } else { "private" }),
  [string]$VercelProjectName = $(if ($env:VERCEL_PROJECT_NAME) { $env:VERCEL_PROJECT_NAME } else { $RepoName })
)

$ErrorActionPreference = "Stop"

function Require-Env {
  param([string]$Name)
  if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($Name))) {
    throw "Missing required environment variable: $Name"
  }
}

function Invoke-GitHub {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null
  )

  $headers = @{
    Authorization          = "Bearer $env:GITHUB_TOKEN"
    Accept                 = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"           = "arinas-deployment-setup"
  }

  $params = @{
    Method  = $Method
    Uri     = "https://api.github.com$Path"
    Headers = $headers
  }

  if ($null -ne $Body) {
    $params.ContentType = "application/json"
    $params.Body = ($Body | ConvertTo-Json -Depth 20)
  }

  Invoke-RestMethod @params
}

function Invoke-Vercel {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null
  )

  $separator = if ($Path.Contains("?")) { "&" } else { "?" }
  $teamQuery = if ($env:VERCEL_TEAM_ID) { "$separator" + "teamId=$env:VERCEL_TEAM_ID" } else { "" }
  $headers = @{
    Authorization = "Bearer $env:VERCEL_TOKEN"
    "User-Agent"  = "arinas-deployment-setup"
  }

  $params = @{
    Method  = $Method
    Uri     = "https://api.vercel.com$Path$teamQuery"
    Headers = $headers
  }

  if ($null -ne $Body) {
    $params.ContentType = "application/json"
    $params.Body = ($Body | ConvertTo-Json -Depth 20)
  }

  Invoke-RestMethod @params
}

function Test-GitHubRepo {
  param([string]$RepoOwner, [string]$Name)
  try {
    Invoke-GitHub -Method GET -Path "/repos/$RepoOwner/$Name" | Out-Null
    return $true
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) { return $false }
    throw
  }
}

function Ensure-VercelProject {
  param([string]$ProjectName, [string]$RepoOwner, [string]$Name)

  try {
    return Invoke-Vercel -Method GET -Path "/v9/projects/$ProjectName"
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 404) { throw }
  }

  $body = @{
    name = $ProjectName
    framework = "nextjs"
    installCommand = "npm ci"
    buildCommand = "npm run build"
    devCommand = "npm run dev"
    gitRepository = @{
      type = "github"
      repo = "$RepoOwner/$Name"
    }
  }

  Invoke-Vercel -Method POST -Path "/v10/projects" -Body $body
}

function Add-VercelEnv {
  param(
    [string]$ProjectId,
    [string]$Key,
    [string]$Value,
    [string[]]$Targets
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "Skipping $Key because no value was provided in the current environment."
    return
  }

  $body = @{
    key = $Key
    value = $Value
    type = "encrypted"
    target = $Targets
  }

  try {
    Invoke-Vercel -Method POST -Path "/v10/projects/$ProjectId/env" -Body $body | Out-Null
    Write-Host "Configured Vercel environment variable: $Key"
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
      Write-Host "Vercel environment variable already exists: $Key"
      return
    }
    throw
  }
}

Require-Env "GITHUB_TOKEN"
Require-Env "VERCEL_TOKEN"

$user = Invoke-GitHub -Method GET -Path "/user"
if ([string]::IsNullOrWhiteSpace($Owner)) {
  $Owner = $user.login
}

if (-not (Test-Path ".git")) {
  git init
}

git branch -M main

$repoExists = Test-GitHubRepo -RepoOwner $Owner -Name $RepoName
if (-not $repoExists) {
  $createBody = @{
    name = $RepoName
    private = ($Visibility -eq "private")
    auto_init = $false
    has_issues = $true
    has_projects = $false
    has_wiki = $false
  }

  if ($Owner -eq $user.login) {
    Invoke-GitHub -Method POST -Path "/user/repos" -Body $createBody | Out-Null
  } else {
    Invoke-GitHub -Method POST -Path "/orgs/$Owner/repos" -Body $createBody | Out-Null
  }
}

$remoteUrl = "https://github.com/$Owner/$RepoName.git"
if (git remote get-url origin 2>$null) {
  git remote set-url origin $remoteUrl
} else {
  git remote add origin $remoteUrl
}

git add --all
if (-not [string]::IsNullOrWhiteSpace((git status --porcelain))) {
  git commit -m "Automate GitHub and Vercel deployment"
}

git push -u origin main

$protection = @{
  required_status_checks = @{
    strict = $true
    contexts = @("quality-gate")
  }
  enforce_admins = $true
  required_pull_request_reviews = @{
    dismiss_stale_reviews = $true
    require_code_owner_reviews = $false
    required_approving_review_count = 1
    require_last_push_approval = $true
  }
  restrictions = $null
  required_linear_history = $true
  allow_force_pushes = $false
  allow_deletions = $false
  block_creations = $false
  required_conversation_resolution = $true
  lock_branch = $false
  allow_fork_syncing = $true
}
Invoke-GitHub -Method PUT -Path "/repos/$Owner/$RepoName/branches/main/protection" -Body $protection | Out-Null

$project = Ensure-VercelProject -ProjectName $VercelProjectName -RepoOwner $Owner -Name $RepoName
$projectId = if ($project.id) { $project.id } else { $project.name }

$allTargets = @("production", "preview", "development")
$clientTargets = @("production", "preview", "development")
$serverTargets = @("production", "preview")

$envMap = @{
  NEXT_PUBLIC_SITE_URL = $clientTargets
  NEXT_PUBLIC_SUPABASE_URL = $clientTargets
  NEXT_PUBLIC_SUPABASE_ANON_KEY = $clientTargets
  SUPABASE_SERVICE_ROLE_KEY = $serverTargets
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = $clientTargets
  STRIPE_SECRET_KEY = $serverTargets
  STRIPE_WEBHOOK_SECRET = $serverTargets
  NEXT_PUBLIC_ANALYTICS_ID = $clientTargets
  ANALYTICS_API_KEY = $serverTargets
  EMAIL_PROVIDER = $allTargets
  EMAIL_FROM = $allTargets
  RESEND_API_KEY = $serverTargets
  POSTMARK_SERVER_TOKEN = $serverTargets
  SENDGRID_API_KEY = $serverTargets
}

foreach ($entry in $envMap.GetEnumerator()) {
  Add-VercelEnv -ProjectId $projectId -Key $entry.Key -Value ([Environment]::GetEnvironmentVariable($entry.Key)) -Targets $entry.Value
}

Write-Host "Deployment automation complete."
Write-Host "GitHub: https://github.com/$Owner/$RepoName"
Write-Host "Vercel project: $VercelProjectName"
