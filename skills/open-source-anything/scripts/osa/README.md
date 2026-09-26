# osa: the project launcher

`osa` lists every project built with the open-source-anything skill and starts, stops and opens them with one click. It's written for people who never want to think about installing packages or remembering how to run each project.

- **One folder for everything.** Projects live in `~/Documents/open-source-anything/` (or `~/open-source-anything/` if there's no Documents folder). Set `OSA_HOME` to use another folder.
- **Double-click to open.** `osa setup` adds a "Start projects" file to that folder (`.command` on macOS, `.cmd` on Windows, `.sh` on Linux). Opening it shows a page in your browser listing every project, with **Start**, **Stop** and **Open**.
- **No setup chores.** On first start, `osa`:
  - installs dependencies;
  - creates `.env` from `.env.example`, filling in secrets and passwords;
  - picks a free port;
  - waits until the app answers;
  - shows any sign-in details you need.

  Later starts take seconds. It reinstalls only when a project's dependencies change.
- **Only Node.js required.** `osa` itself has no dependencies. Individual projects may need other tools, such as Python, and `osa` explains in plain words what's missing and where to get it.

![The launcher](../../../../docs/launcher/projects.png)

## Using it

The step-by-step guide, with what each button does and what to do when something goes wrong, is in the main README: [Install the launcher](../../../../README.md#2-the-launcher-once-per-computer) and [Run your projects](../../../../README.md#run-your-projects). In short:

1. Once per computer, with [Node.js](https://nodejs.org) installed: `npx github:chiradeep-varma/open-source-skill setup`.
2. Put each project's folder in the projects folder, which `npx github:chiradeep-varma/open-source-skill where` prints.
3. Double-click **Start projects** in that folder, then press **Start** and **Open** next to a project.

Every command, from a terminal:

| Command | What it does |
|---|---|
| `osa` | Opens the launcher page (same as `osa dashboard`) |
| `osa list` | Lists projects and whether they're running |
| `osa start <name>` | Installs if needed, starts, prints the address and sign-in details (`--open` opens the browser) |
| `osa stop <name>` / `osa stop --all` | Stops a project, or everything |
| `osa open <name>` | Opens a running project in the browser |
| `osa logs <name>` | Shows the latest install, setup and app output |
| `osa check <folder>` | Validates a project's `osa.json` and checks this machine has what it needs |
| `osa add <folder>` | Shows a project that lives elsewhere |
| `osa setup` | Creates the projects folder, the double-click launcher and a README |
| `osa where` | Prints the projects folder |

Projects keep running after the launcher page or window is closed. Stop them from the page, or with `osa stop --all`.

## `osa.json`: how a project tells the launcher how to run

Every project has an `osa.json` at its root. The skill writes it; you shouldn't need to.

```json
{
  "name": "amber-otter",
  "summary": "Short links with click analytics",
  "kind": "web",
  "requires": { "node": ">=20" },
  "install": "npm install",
  "setup": "npm run migrate",
  "start": "npm start",
  "port": 3000,
  "portEnv": "PORT",
  "open": "/",
  "env": {
    "example": ".env.example",
    "file": ".env",
    "generate": ["SESSION_SECRET", "ADMIN_PASSWORD"],
    "reveal": ["ADMIN_EMAIL", "ADMIN_PASSWORD"],
    "set": { "BASE_URL": "http://localhost:{port}" }
  }
}
```

| Field | Meaning |
|---|---|
| `name` | The project's codename. Letters, numbers, `.`, `-`, `_`. |
| `summary` | One line on what it does, in its own terms. |
| `kind` | `web` (has a server to start; the default), `cli`, `desktop` or `other`. Only `web` projects get Start and Stop. Others show `usage` instead. |
| `requires` | Tools and minimum versions: `node`, `python`, `go`, `rust`, or any command that answers `--version`. |
| `install` | Installs dependencies. It runs on first start and whenever a dependency file changes. |
| `setup` | Optional. Runs before every start, after install (for example, migrations). It must be safe to repeat. |
| `start` | Starts the app in the foreground. It must listen on the port in the `portEnv` variable. |
| `port` / `portEnv` | Preferred port, and the variable it's passed in (default `PORT`). If the port is busy, the next free one is used. |
| `open` | The path to open in the browser once the app answers (default `/`). |
| `env.generate` | Keys to fill in `.env` when missing or left as a placeholder. Names containing PASSWORD get a readable password; everything else gets a 64-character hex secret. Existing values are never changed. |
| `env.reveal` | Keys whose values are shown to the user next to the running project (for example, the sign-in password). |
| `env.set` | Values passed to the app on every start. `{port}` is replaced with the actual port. |
| `usage` | For non-web kinds: how to use it (shown in the launcher). |

Commands can be a string, or per platform: `{ "default": "...", "win32": "..." }`. Python projects, for example:

```json
"install": { "default": "python3 -m venv .venv && .venv/bin/pip install -r requirements.txt",
             "win32": "py -m venv .venv && .venv\\Scripts\\pip install -r requirements.txt" },
"start":   { "default": ".venv/bin/uvicorn app.main:app --port $PORT",
             "win32": ".venv\\Scripts\\uvicorn app.main:app --port %PORT%" }
```

## How it works

- Per-project state lives in `<project>/.osa/`: `run.json` (PID and port), `state.json` (what was installed), and `logs/`. Add `.osa/` to `.gitignore`.
- Apps outlive the launcher. On macOS and Linux each app leads its own process group, so stopping ends the whole tree. On Windows a small keeper process (`lib/keeper.js`) runs each app with a hidden console and copies its output to the log; stopping uses `taskkill /T`.
- A run record from before the computer last started is ignored, so a reused process ID is never mistaken for your app.
- The launcher page listens on `127.0.0.1` only. Every action needs a per-session token and a matching `Host` header, so other websites can't start or stop your projects.

## Development

```bash
npm test   # from the repository root: unit tests plus integration tests that start and stop real processes
```

CI runs these tests on Linux, macOS and Windows with Node 18 and 22, and installs the CLI globally on each. The tests start and stop real processes, check the logs, and cover the Windows keeper process. What CI can't exercise is a person double-clicking **Start projects** in Finder or Explorer, and the browser opening; those follow each platform's documented behavior.
