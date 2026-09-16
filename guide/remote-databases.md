---
title: Remote Database Connections
description: Connect Rezure to a staging server, VPS, or shared MySQL/MariaDB instance — including databases reachable only through an SSH tunnel.
---

# Remote Database Connections

Rezure's **Databases** page isn't limited to the MariaDB it runs locally. You can add
**remote connections** to servers Rezure doesn't manage — a staging box, a VPS, a shared
hosting instance — and use the same page to list schemas, export dumps, import SQL, and
hand a database off to TablePlus, DBeaver, HeidiSQL, or another client you already have.

Rezure never starts or stops a remote server. It only connects, reads, and (when you allow
it) writes.

## What you can do on a remote target

When you switch the **Databases** page to a saved connection, you get the same workflow as
the local server, with a few deliberate differences:

- **List databases** — table counts and sizes, refreshed on demand.
- **Export** — dump a schema to a `.sql` file in Rezure's dumps folder. Remote exports use
  `--single-transaction` so a shared server isn't locked for other users.
- **Import** — load a dump onto the remote server when the connection is not read-only.
  Rezure asks you to type the database name back before a remote import runs.
- **Open in client** — launch your installed SQL GUI pointed at the remote server (through
  the tunnel, if one is configured).

Remote targets are **read-only by default**. Create, drop, and import stay hidden until you
turn read-only off when saving the connection.

The **Used by** column is hidden for remote servers — matching a schema name to a local
project only makes sense on your machine.

## Add a connection

1. Open the **Databases** page.
2. Open the target switcher (top of the page) and click **Add connection**.
3. Fill in the database details:
   - **Name** — a label you'll recognise (`Staging`, `Production read replica`, etc.).
   - **Host** and **Port** — where the database listens **from the machine that connects
     to it** (see [SSH tunnel](#connect-through-an-ssh-tunnel) below if that's not your PC).
   - **User** and **Password** — the database account, not the SSH login.
   - **Server engine** — MySQL or MariaDB. Rezure picks the matching client binary; a
     MariaDB client cannot authenticate against some MySQL 8 accounts.
   - **Encryption** — Automatic (TLS if offered), Required, or Off.
4. Click **Test connection**. Rezure runs `SELECT VERSION()` and shows the server's own
   version string on success. Saving is blocked until the test passes — so a green result
   means the saved connection will actually work.
5. Click **Save**.

Connection settings (without passwords) are stored in `%APPDATA%\Rezure\connections.json`.
Database passwords can be saved in **Windows Credential Manager**, or kept in memory for
the current session only.

## Switch to a remote server

Use the target switcher on the **Databases** page:

- Pick a saved connection to **read** that server.
- Pick your local profile again to switch back.

Switching targets does **not** stop your local MariaDB. The **Services** page still shows
whether Nginx, PHP, and the local database are running — independent of which server the
Databases page is displaying.

If a connection was saved without a password, Rezure prompts for it the first time you
select it.

## Connect through an SSH tunnel

Many remote databases aren't reachable from the internet at all. They listen on
`127.0.0.1` on the server itself, or sit behind a firewall that blocks the database port.
For those, enable **Connect through an SSH tunnel** when adding the connection.

### How the fields fit together

With SSH enabled, there are two hops:

1. **SSH** — your PC connects to the server (`SSH host`, `SSH port`, `SSH user`).
2. **Database** — from the SSH server's point of view, the database is at **Host** and
   **Port** in the main form.

That usually means:

| Field | Typical value | Meaning |
| --- | --- | --- |
| SSH host | `203.0.113.10` or `staging.example.com` | The machine you SSH into |
| SSH port | `22` | SSH port on that machine |
| SSH user | `deploy`, `ubuntu`, `root`, … | Your SSH login |
| Host (database) | `127.0.0.1` | Database listens on the server's loopback |
| Port (database) | `3306` | MySQL/MariaDB port on the server |

Rezure runs Windows' built-in OpenSSH client (`C:\Windows\System32\OpenSSH\ssh.exe`) with a
local port forward:

```
ssh -N -L 127.0.0.1:<free port>:<db host>:<db port> user@ssh-host
```

Everything after the tunnel is up — queries, exports, imports, opening in DBeaver — goes
through `127.0.0.1` on your machine, exactly as if the database were local.

The tunnel stays open while you use the connection and is torn down when you quit Rezure or
remove the connection. Reuse is automatic: several exports in one session pay the SSH
handshake once, not per click.

### SSH authentication

Rezure supports two methods:

**Private key (recommended)**

- Point to the **private key file** itself — for example
  `C:\Users\you\.ssh\id_ed25519`, not a folder and not your password typed into the path
  box.
- Use **Browse** to pick the file.
- The key must **not have a passphrase**. Rezure has no console to answer a passphrase
  prompt during an SSH session.

**Password**

- Enter the SSH login password in the **SSH password** field.
- Rezure passes it to `ssh.exe` through OpenSSH's `SSH_ASKPASS` mechanism — never on the
  command line.

The SSH password and the database password are separate accounts. Don't mix them up.

### TLS with a tunnel

Traffic inside the SSH session is already encrypted. Many people set **Encryption** to
**Off** for tunneled connections, but **Automatic** still works if the database server
expects TLS even on localhost.

### Example: Laravel app on a VPS

Your app runs on a VPS. MySQL only accepts connections from `127.0.0.1` on that box, and
port 3306 isn't open to the world.

```
Name:     Staging VPS
Host:     127.0.0.1
Port:     3306
User:     forge
Password: (your DB password)

☑ Connect through an SSH tunnel
SSH host: 203.0.113.10
SSH port: 22
SSH user: forge
Auth:     Private key → C:\Users\you\.ssh\id_ed25519
```

Click **Test connection**. If it succeeds, save and switch to **Staging VPS** in the target
switcher.

## Read-only connections

New connections default to **Read-only**. That blocks:

- Creating a database
- Dropping a database
- Importing SQL

Leave read-only on for production servers you only want to inspect or export from. Turn it
off when you intentionally need to write — staging imports, schema fixes, and the like.

## Export and import notes

**Exports** from remote servers land in the same dumps folder as local exports, with the
connection name prefixed on the filename so a staging dump doesn't get confused with a local
one. Large remote dumps can take a while — the data crosses the network.

**Imports** to a remote server require typing the target database name to confirm. Rezure
runs `CREATE DATABASE IF NOT EXISTS` before executing the file. If your remote user lacks
`CREATE` privilege, the error from the server is shown as-is.

## Open in an external client

**Open** detects SQL clients installed on your machine. For a tunneled connection, Rezure
hands the client the forwarded local endpoint — you don't configure the SSH hop yourself.

If no compatible MySQL or MariaDB client is installed locally, the connection appears in
the switcher but is disabled with a note explaining what's missing.

## Troubleshooting

### Test connection fails with "SSH tunnel failed"

Read the message — Rezure surfaces the last lines from `ssh`'s log. Common causes:

- **Wrong SSH host, user, or key path** — `Permission denied` from the server.
- **Key has a passphrase** — generate a deploy key without one, or use password auth.
- **Private key path is wrong** — pick the file, not a password pasted into the key box.
- **Database host/port wrong on the server side** — remember Host is resolved **on the SSH
  server**, not on your PC. If MySQL listens on `127.0.0.1:3306` there, use exactly that.
- **SSH reachable but database isn't** — MySQL stopped on the server, or it listens on a
  socket only (use `127.0.0.1`, not a hostname that resolves differently on the server).

### Test passes but export is slow or times out

Remote dumps depend on network speed and server load. Very large schemas may take several
minutes. Prefer exporting during off-peak hours on shared hosting.

### "No MySQL/MariaDB client installed to reach it"

Rezure needs a local `mysql` or `mariadb` client binary to talk to remote servers — usually
from the MariaDB Rezure installed, or another profile's binaries. Install a PHP/database
profile locally or add a MariaDB build from the **PHP** or database profile pages.

### Connection works once, then fails later

SSH tunnels can die if the server closes idle sessions. Rezure sends keepalives, but a
sleeping laptop or a changed server key can still break an old session. Switch away and
back, or test the connection again — Rezure starts a fresh tunnel when the old one is dead.

### Strict host key / first connect

On first contact with an SSH server, Rezure accepts a new host key automatically
(`StrictHostKeyChecking=accept-new`). If the server's key changes later, SSH will refuse
the connection until you update `known_hosts` yourself — the same as any OpenSSH client.

## Related

- [First Run](/guide/first-run) — local MariaDB credentials and the default workflow
- [FAQ](/guide/faq) — ports, permissions, and what Rezure installs
