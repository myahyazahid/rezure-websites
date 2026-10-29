---
title: 'How to Uninstall Rezure Completely from Windows'
titleTemplate: false
description: 'Uninstall Rezure from Windows completely: the uninstaller, then the projects, databases, hosts entries, PATH changes, and saved passwords it leaves behind.'
---

# Uninstall Rezure

Uninstalling the app removes the program, but deliberately **not** your projects, databases, or
settings in `C:\rezure`, the same separation that makes reinstalling safe. This page covers
the uninstaller and then everything else, so you can remove as much or as little as you want.

## Before you uninstall

Do these while Rezure is still installed; each one undoes a change Rezure made outside its own
folder.

1. **Export anything you want to keep.** Databases live inside `C:\rezure\data`. Export them from
   the **Databases** page, then copy `C:\rezure\dumps` somewhere safe.
2. **Copy your projects** out of `C:\rezure\www`, if they don't live elsewhere already.
3. **Stop all services** on the Services page.
4. On the **Switch** page, turn off **Use Rezure's PHP everywhere**. That removes Rezure's entry
   from your user `PATH` and from `PHP_INI_SCAN_DIR`.
5. In **Settings**, turn off **Start Rezure with Windows**.
6. On the **Databases** page, remove saved connections you no longer need; that also deletes
   their passwords from Windows Credential Manager.
7. Quit Rezure from the tray icon.

## Run the uninstaller

Open **Settings → Apps → Installed apps**, find **rezureapp**, and choose **Uninstall**, or run
`uninstall.exe` in the folder Rezure was installed to. This removes the app and its bundled
files.

## Remove what's left

### `C:\rezure`

Delete the folder to remove projects, databases, downloaded runtimes, settings, and logs in one
go. **This deletes `www` and your databases**; make sure step 1 and 2 above are done.

Also delete these if they exist; they're from older versions of Rezure:

- `%LOCALAPPDATA%\Rezure`
- `%APPDATA%\Rezure`
- `%USERPROFILE%\rezure`

### The hosts file entries

Open Notepad **as administrator**, open `C:\Windows\System32\drivers\etc\hosts`, and delete the
block between these two lines (the lines themselves included):

```
# --- Rezure managed entries (do not edit below) ---
# --- Rezure managed entries end ---
```

### `PATH`, if you skipped step 4

Open **Edit environment variables for your account** from the Start menu. In your user
variables, remove `C:\rezure\current\php` from **Path**, and remove `C:\rezure\etc\php\conf.d`
from **PHP_INI_SCAN_DIR** (delete the variable if that was its only value).

### Saved passwords, if you skipped step 6

Open **Credential Manager → Windows Credentials** and remove the generic credentials whose names
include **Rezure Database Connections**.

### Start with Windows, if you skipped step 5

Open **Task Manager → Startup apps** and disable or remove Rezure's entry.

### SQL Server LocalDB and the ODBC Driver

These are separate Microsoft installs, and uninstalling Rezure doesn't remove them; other
programs may use them too.

If you're sure nothing else needs them, first remove Rezure's LocalDB instance in a terminal:

```bat
SqlLocalDB stop Rezure
SqlLocalDB delete Rezure
```

Then uninstall **Microsoft SQL Server 2022 Express LocalDB** and **Microsoft ODBC Driver 18 for
SQL Server** from **Settings → Apps**.

## Reinstalling later

If you keep `C:\rezure`, a fresh install picks up right where you left off: same projects, same
databases, same settings.

## Related

- [Files & Folders](/guide/files-and-folders): everything Rezure creates, and where
- [Installation](/guide/installation): installing again
