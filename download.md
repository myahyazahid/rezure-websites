---
title: Download Rezure for Windows
titleTemplate: false
description: Download the latest Rezure release for Windows. Free and open source, with system requirements, previous versions, and SHA-256 checksum verification.
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
| **Disk space** | ~400 MB for the app and the bundled Nginx + PHP, plus room for whatever you add: each extra PHP version, MariaDB, Node.js, and roughly 150 MB per PostgreSQL version, and your own projects |
| **Memory** | 4 GB RAM minimum, 8 GB recommended once a database is running |
| **Permissions** | Administrator approval is needed to edit the Windows `hosts` file, and once each for Microsoft's ODBC Driver and SQL Server LocalDB if you install them. Everything else runs as your normal user. |

Rezure targets Windows only for now. macOS and Linux builds are not available.

## Updating

Once Rezure is installed you don't need to come back here for new versions. When an update is
out, a dot appears on **Changelog** in the app's sidebar; open it and click **Update**. Every
update is signed, and Rezure refuses one whose signature doesn't check out. See
[Updates & Changelog](/guide/updates).

## Previous versions

Every build Rezure has shipped stays on the
[GitHub releases page](https://github.com/myahyazahid/rezure/releases), newest first. If a
new version misbehaves, download the previous installer from there and run it over your
current install: your projects, databases, and settings live in `C:\rezure`, outside the app
folder, and are left alone.

## Verify your download

Each release page lists a SHA-256 hash for its installer. To check the file you downloaded,
open PowerShell in your downloads folder and run:

```powershell
Get-FileHash .\rezureapp_3.3.0_x64-setup.exe -Algorithm SHA256
```

Use the name of the file you actually downloaded. Compare the `Hash` value with the one on the
release page; they should match exactly, ignoring case. If they don't, delete the file and
download it again; don't run an installer whose hash doesn't line up.
