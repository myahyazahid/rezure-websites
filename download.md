---
title: Download
description: Download the latest Rezure release for Windows, with system requirements and checksum verification.
---

# Download Rezure

Rezure ships as a Windows installer. Grab the latest build below, then follow the
[installation guide](/guide/installation) for the first-run steps.

<LatestRelease />

## System requirements

| | |
|---|---|
| **Operating system** | Windows 10 (build 1809 or newer) or Windows 11, 64-bit |
| **WebView2 runtime** | Usually pre-installed on Windows 10/11. If setup reports it missing, install it from [Microsoft's WebView2 page](https://developer.microsoft.com/microsoft-edge/webview2/). |
| **Disk space** | ~400 MB for the app and the bundled Nginx + PHP, plus room for any extra PHP versions, MariaDB, and your own projects |
| **Memory** | 4 GB RAM minimum, 8 GB recommended once MariaDB is running |
| **Permissions** | Administrator rights are needed to edit the Windows `hosts` file when Rezure sets up a virtual host |

Rezure targets Windows only for now. macOS and Linux builds are not available.

## Previous versions

Every build Rezure has shipped stays on the
[GitHub releases page](https://github.com/myahyazahid/rezure/releases), newest first. If a
new version misbehaves, download the previous installer from there and run it over your
current install — your projects and settings live outside the app folder and are left
alone.

## Verify your download

Each release page lists a SHA-256 hash for its installer. To check the file you downloaded,
open PowerShell in your downloads folder and run:

```powershell
Get-FileHash .\Rezure_Setup.exe -Algorithm SHA256
```

Compare the `Hash` value with the one on the release page — they should match exactly,
ignoring case. If they don't, delete the file and download it again; don't run an installer
whose hash doesn't line up.
