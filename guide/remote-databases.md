---
title: Remote Database Connections
description: Connect Rezure to a staging server, VPS, or shared MySQL, MariaDB, PostgreSQL, or SQL Server instance — including databases reachable only through an SSH tunnel.
---

# Remote Database Connections

Rezure's **Databases** page isn't limited to the servers it runs locally. You can add
**connections** to servers Rezure doesn't manage — a staging box, a VPS, a shared hosting
instance, an office SQL Server — and use the same page to list databases, export dumps,
import SQL, and hand a database off to the client you already use.

Rezure never starts or stops a remote server. It only connects, reads, and (when you allow
it) writes.

Three kinds of server are supported: **MySQL / MariaDB**, **PostgreSQL**, and
**SQL Server**. Each can be reached directly or through an SSH tunnel.

## What you can do on a remote target

When you switch the **Databases** page to a saved connection, you get the same workflow as
the local server, with a few deliberate differences:

- **List databases** — table counts and sizes. The refresh icon re-reads them.
- **Export** — dump a database to a file in `C:\rezure\dumps`. MySQL/MariaDB and PostgreSQL
  write a `.sql` dump. (A remote SQL Server can't be exported from Rezure — see
  [below](#export-and-import-notes).)
- **Import** — load a `.sql` file onto the remote server when the connection is not
  read-only. Rezure asks you to type the database name back before a remote import runs.
- **Open** — launch your installed SQL client pointed at the remote server (through the
  tunnel, if one is configured).

Remote targets are **read-only by default**. **New database** is disabled and **Import .sql**
is hidden until you save a connection with **Read-only** turned off.

The **Used by** column is hidden for remote servers — matching a database name to a local
project only makes sense on your machine.

## What Rezure needs locally

Rezure talks to remote servers with real client tools, so one local piece is required per
kind of server:

| Server type | Needs | Get it from |
| --- | --- | --- |
| MySQL / MariaDB | Any installed MySQL or MariaDB build (its `mysql`/`mariadb` client and dump tool) | **Switch → Install version → MariaDB**, or a MySQL build unzipped into `C:\rezure\custom\mysql` |
| PostgreSQL | Any installed PostgreSQL build (`psql` and `pg_dump`) | **Switch → Install version → PostgreSQL**, or **Install PostgreSQL** in the Add connection form |
| SQL Server | Microsoft ODBC Driver 17 or 18 for SQL Server | **Install ODBC Driver** in the Add connection form or on PHP Extensions — see [SQL Server](/guide/sql-server) |

For PostgreSQL, Rezure uses the **newest** build you have installed, because `pg_dump`
refuses to dump a server newer than itself. If a remote runs PostgreSQL 18, install 18
locally.

When the piece is missing, the connection still appears in the switcher, disabled, with a
note saying what to install.

## Add a connection

1. Open the **Databases** page.
2. Open the target switcher (top of the page) and click **+ Add connection**.
3. Fill in the details:
   - **Name** — a label you'll recognise (`Staging`, `Production read replica`, etc.).
   - **Server type** — **MySQL / MariaDB**, **SQL Server**, or **PostgreSQL**. Picking one
     fills in its usual port and user (3306 / `root`, 1433 / `sa`, 5432 / `postgres`)
     unless you already typed your own.
   - **Host** and **Port** — where the database listens **from the machine that connects to
     it** (see [SSH tunnel](#connect-through-an-ssh-tunnel) below if that's not your PC).
   - **User** and **Password** — the database account, not the SSH login.
   - **Server engine** (MySQL / MariaDB only) — **MySQL** or **MariaDB**. Rezure prefers
     the matching client and falls back to the other one if that's all you have. A MariaDB
     client can't sign in to some MySQL 8 accounts; see
     [troubleshooting](#caching-sha2-password-or-authentication-plugin-errors).
   - **Encryption** — **Automatic** (use TLS when the server offers it), **Required**
     (refuse to connect without it), or **Off** (for a private network or an SSH tunnel).
4. Click **Test connection**. On success Rezure shows "Connected — server reports" and the
   server's own version string. **Save** stays disabled until a test passes, and any change
   to the form clears the result — so a green test means the saved connection works.
5. Click **Save**.

Rezure refuses to save the same server twice: if host, port, user, and SSH host all match an
existing connection, it tells you which one.

### SQL Server specifics

- **Host** can be a name and instance, like `db.office.local\SQLEXPRESS`. For a named
  instance, leave **Port** empty — SQL Server Browser hands out the real port.
- **Sign in with** — **SQL Server login** (user and password) or **Windows account**.
  Windows account signs in as the Windows user Rezure runs as; no password is stored
  anywhere. It works for servers on this machine and on your office domain.
- **Trust server certificate** — off by default. Turn it on only for a server you trust that
  uses a self-signed certificate.
- When you choose SQL Server, Rezure scans this PC for installed SQL Server editions and
  LocalDB instances and lists them under **Found on this computer**. Clicking one fills in the
  form; you still test and save it. See [SQL Server](/guide/sql-server#connect-to-another-sql-server).

### Where connections are stored

Connection settings (without passwords) are stored in `C:\rezure\etc\connections.json`.

Passwords are never written to that file. With **Save the password in Windows Credential
Manager** ticked (the default), Rezure stores it there under **Rezure Database
Connections**. Untick it and Rezure asks once per session and keeps the password in memory
only.

## Switch to a remote server

Use the target switcher on the **Databases** page. It has two sections:

- **Data directory** — your local MySQL/MariaDB profiles (see
  [MariaDB & MySQL](/guide/mariadb-mysql)).
- **Connections** — remote servers, plus Rezure's own PostgreSQL and SQL Server LocalDB once
  they're installed.

Pick a connection to read that server ("Now reading Staging."). Pick your local profile again
to switch back. The choice is remembered across restarts.

Switching targets does **not** stop or start anything. The **Services** page still shows
whether Nginx, PHP, and the local databases are running, independent of which server the
Databases page is displaying.

### "Needs password" and Unlock

A connection saved without a password shows an amber **Needs password** badge. Selecting it
opens **Password for {name}**: type the password and click **Unlock**. The **Save it in
Windows Credential Manager** checkbox there lets you change your mind either way — unticking
it deletes a copy saved earlier.

## Connect through an SSH tunnel

Many remote databases aren't reachable from the internet at all. They listen on
`127.0.0.1` on the server itself, or sit behind a firewall that blocks the database port.
For those, enable **Connect through an SSH tunnel** when adding the connection. Tunnels work
for all three server types.

### How the fields fit together

With SSH enabled, there are two hops:

1. **SSH** — your PC connects to the server (`SSH host`, `SSH port`, `SSH user`).
2. **Database** — from the SSH server's point of view, the database is at **Host** and
   **Port** in the main form.

Turning the tunnel on pre-fills **Host** with `127.0.0.1`, because that's usually right:

| Field | Typical value | Meaning |
| --- | --- | --- |
| SSH host | `203.0.113.10` or `staging.example.com` | The machine you SSH into |
| SSH port | `22` | SSH port on that machine |
| SSH user | `deploy`, `ubuntu`, `root`, … | Your SSH login |
| Host (database) | `127.0.0.1` | Database listens on the server's loopback |
| Port (database) | `3306`, `5432`, or `1433` | The database's real port on the server |

Rezure runs Windows' built-in OpenSSH client (`C:\Windows\System32\OpenSSH\ssh.exe`) with a
local port forward:

```
ssh -N -L 127.0.0.1:<free port>:<db host>:<db port> user@ssh-host
```

Because it's the standard OpenSSH client, your `~\.ssh\config` and `known_hosts` apply as
usual. Everything after the tunnel is up — queries, exports, imports, opening in DBeaver —
goes through `127.0.0.1` on your machine, exactly as if the database were local.

Each connection gets its own tunnel on its own free local port, so several tunnelled
connections can be open at once. A tunnel stays open while you use the connection and is
torn down when you quit Rezure or remove the connection. Reuse is automatic: several exports
in one session pay the SSH handshake once, not per click. **Test connection** opens a
temporary tunnel of its own.

### SSH authentication

Rezure supports two methods:

**Private key (recommended)**

- Point to the **private key file** itself — for example
  `C:\Users\you\.ssh\id_ed25519`, not a folder and not your password typed into the path
  box.
- Use **Browse** to pick the file.
- The key must **not have a passphrase**. Rezure has no console to answer a passphrase
  prompt during an SSH session.
- Use an OpenSSH-format key. A PuTTY `.ppk` key has to be converted first (PuTTYgen →
  **Conversions → Export OpenSSH key**).
- Rezure hands `ssh` a private copy of the key that only your account can read, so you don't
  hit OpenSSH's "bad permissions" error. A `-cert.pub` certificate next to the key is copied
  too. Your own key file is never modified.

**Password**

- Enter the SSH login password in the **SSH password** field.
- Rezure passes it to `ssh.exe` through OpenSSH's askpass mechanism — never on the command
  line. Only one attempt is made per connection.
- The SSH password is always kept in Windows Credential Manager, separately from the
  database password.

The SSH password and the database password are separate accounts. Don't mix them up.

### TLS with a tunnel

Traffic inside the SSH session is already encrypted. Many people set **Encryption** to
**Off** for tunnelled connections, but **Automatic** still works if the database server
expects TLS even on localhost.

### Example: Laravel app on a VPS

Your app runs on a VPS. MySQL only accepts connections from `127.0.0.1` on that box, and
port 3306 isn't open to the world.

```
Name:     Staging VPS
Type:     MySQL / MariaDB
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

Leave read-only on for production servers you only want to inspect or export from. To write
— staging imports, schema fixes, and the like — add the connection with **Read-only**
unticked.

## Change or remove a connection

Saved connections can't be edited. To change anything — host, password policy, encryption,
read-only — remove the connection and add it again.

To remove one, hover its row in the switcher and click the trash icon. **There's no
confirmation.** Removing a connection also deletes its saved passwords from Windows
Credential Manager and closes its tunnel. Rezure's own **PostgreSQL** and **SQL Server
LocalDB** connections can't be removed.

## Export and import notes

**Exports** from remote servers land in `C:\rezure\dumps` like local exports, with the
connection name prefixed on the filename (`staging-eu-blog-20261024-101500.sql`) so a staging
dump doesn't get confused with a local one. Large remote dumps can take a while — the data
crosses the network. MySQL/MariaDB exports show a progress bar and can be cancelled;
PostgreSQL exports show progress but can't be cancelled.

A **remote SQL Server** can't be exported: SQL Server's `BACKUP` writes the `.bak` file onto
the server's own disk, not yours. Restoring a `.bak` onto a remote server isn't offered
either. Importing a `.sql` script works.

**Imports** to a remote server require typing the target database name to confirm. If the
database doesn't exist, Rezure creates it first; if your remote user lacks the privilege to
do that, the server's error is shown as-is. Imports aren't transactional: a failure halfway
leaves the statements before it applied.

## Open in an external client

**Open** detects SQL clients installed on your machine and lists the ones that understand the
server type. For a tunnelled connection, Rezure hands the client the forwarded local endpoint
— you don't configure the SSH hop yourself. Clients are never given your password; they ask
for it themselves.

Which client opens what is listed on [MariaDB & MySQL](/guide/mariadb-mysql#open-in-a-sql-client),
[PostgreSQL](/guide/postgresql#open-in-a-sql-client), and
[SQL Server](/guide/sql-server#open-in-a-sql-client).

## Troubleshooting

### Test connection fails with "SSH tunnel failed"

Read the message — Rezure surfaces the last lines from `ssh`'s log. Common causes:

- **Wrong SSH host, user, or key** — `Permission denied (publickey)` from the server.
- **Key has a passphrase** — generate a deploy key without one, or use password auth.
- **"no SSH key at …"** — the path doesn't point at a key file. Pick the file, not a folder
  or a password pasted into the key box.
- **"didn't come up within 20s"** — the SSH server didn't answer in time: wrong host, a
  firewall, or a VPN you aren't connected to.
- **Database host/port wrong on the server side** — remember Host is resolved **on the SSH
  server**, not on your PC. If MySQL listens on `127.0.0.1:3306` there, use exactly that.
- **SQL Server named instance with no port** — a tunnel needs the instance's real TCP port.
  Put it in **Port**.

### "can't reach host — the connection timed out"

Nothing answered. Usually a firewall is dropping the port, or the server only listens on
`127.0.0.1` on its own machine — in which case use an SSH tunnel. "The connection was
refused" means the host answered but nothing listens on that port: check the server is
running and the port is right.

### Access denied (1698) for root on Ubuntu

The account signs in by operating-system user (`auth_socket` / `unix_socket`), which can't
work over the network. Create a database user with its own password and use that.

### caching_sha2_password or authentication plugin errors

The server is MySQL 8 and the account uses `caching_sha2_password`, which the MariaDB client
can't do. Set **Server engine** to **MySQL** and install a MySQL build under
`C:\rezure\custom\mysql\`, or give the account `mysql_native_password`.

### Import fails with "Unknown collation utf8mb4_0900_…"

That's a MySQL 8 dump going into MariaDB. Replace the collation with `utf8mb4_unicode_ci` in
the file, or import into a MySQL server.

### PostgreSQL: "no pg_hba.conf entry"

The server doesn't allow connections from your address. Add a line for your address to its
`pg_hba.conf`, or connect through an SSH tunnel. A "server version mismatch" error means the
remote is newer than your newest local PostgreSQL build — install that version or newer from
the **Switch** page.

### SQL Server: certificate errors

The server uses a certificate Windows doesn't trust. Remove and re-add the connection with
**Trust server certificate** ticked — only for a server you trust. An "untrusted domain"
error with **Windows account** means your PC isn't on the server's domain; use a SQL Server
login instead.

### "read-only" when trying to write

The connection was saved with **Read-only** on. Remove it and add it again with the box
unticked.

### The connection is selected but nothing loads after a restart

If the password was kept for the session only, it's gone after a restart. Clicking the
already-selected row does nothing, so pick your local profile under **Data directory** first,
then pick the connection again to get the **Unlock** dialog.

### Connection works once, then fails later

SSH tunnels can die if the server closes idle sessions. Rezure sends keepalives, but a
sleeping laptop or a changed server key can still break an old session. Switch away and
back, or test the connection again — Rezure starts a fresh tunnel when the old one is dead.

### Strict host key / first connect

On first contact with an SSH server, Rezure accepts a new host key automatically
(`StrictHostKeyChecking=accept-new`). If the server's key changes later, SSH will refuse
the connection until you update `known_hosts` yourself — the same as any OpenSSH client.

## Related

- [MariaDB & MySQL](/guide/mariadb-mysql) — the local server and data directory profiles
- [PostgreSQL](/guide/postgresql) and [SQL Server](/guide/sql-server) — the other local engines
- [Laravel .env Cheatsheet](/guide/laravel-env) — connection values for every engine
- [FAQ](/guide/faq) — ports, permissions, and what Rezure installs
