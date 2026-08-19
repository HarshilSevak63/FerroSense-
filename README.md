# PROJECT SPEC: FerroSense — Laptop System Monitor (POC Phase)

> **Project Name:** `FerroSense`  
> **Tagline:** Ultra-lightweight, bloat-free laptop vitals and hardware monitor built with Tauri v2, Rust, and React.  
> **Mode:** Trust but Verify — discovery before execution, minimal diffs, flag anything uncertain with `NEEDS CONFIRMATION`.

---

## 1. Objective

Build **FerroSense**, a Proof-of-Concept desktop application that displays live system stats (CPU usage, RAM usage, primary disk usage, battery % & charging status) in a clean, responsive dashboard. Inspired by Acer NitroSense and modern gaming hardware monitors, but scoped down to OS-level telemetry without requiring proprietary vendor drivers.

---

## 2. Scope for this Phase (POC Only)

### In Scope:
- **CPU usage %**: Overall system CPU usage percentage (optional per-core breakdown).
- **RAM usage**: Used vs Total in GB and percentage (`used / total (pct%)`).
- **Disk usage %**: Primary system volume (e.g. `C:` on Windows).
- **Battery state**: Battery percentage + AC charging indicator (gracefully handles desktops/missing battery with `null`/`N/A`).
- **Telemetry Polling**: Auto-refresh interval (every 1.5 seconds / 1500ms).
- **Dashboard UI**: Modern dark theme with 4 core telemetry cards (CPU, RAM, Disk, Battery).

### Explicitly OUT of Scope for this Phase:
- Real hardware temperature sensors (deferred to Phase 1 — requires LibreHardwareMonitor integration / admin rights).
- Fan speed monitoring & fan curve control.
- System tray minimization / auto-start on boot.
- Production installer packaging / auto-updates.

---

## 3. Tech Stack

- **Desktop Shell:** Tauri v2 (latest stable v2.x)
- **Frontend:** React + TypeScript + Vite (Vanilla CSS / modern dark aesthetic)
- **Backend:** Rust (`sysinfo` crate for OS vitals, `starship-battery` fallback if needed)
- **IPC:** Tauri `#[tauri::command]` invoked via `@tauri-apps/api/core` `invoke('get_system_stats')` polled every 1500ms.

---

## 4. GitHub Repository Details & Standards

### 4.1. Repository Metadata
- **Repository Name:** `ferrosense` (or `FerroSense`)
- **Default Branch:** `main`
- **Short Description:** `⚡ Ultra-lightweight, bloat-free laptop vitals & hardware monitor built with Tauri v2, Rust, and React.`
- **License:** MIT License (`LICENSE`)
- **GitHub Topics:**
  - `tauri`
  - `tauri-v2`
  - `rust`
  - `react`
  - `typescript`
  - `vite`
  - `system-monitor`
  - `hardware-monitoring`
  - `nitrosense-alternative`
  - `desktop-app`
  - `sysinfo`

---

### 4.2. Repository File & Folder Structure
```
ferrosense/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml                 # Build & lint check on PR/push
│       └── release.yml            # Tauri Action for multi-platform releases
├── src/                           # React Frontend
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── StatCard.tsx
│   │   └── Phase1Notice.tsx
│   ├── hooks/
│   │   └── useSystemStats.ts
│   ├── types/
│   │   └── stats.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── src-tauri/                     # Rust Backend (Tauri)
│   ├── src/
│   │   ├── lib.rs
│   │   ├── main.rs
│   │   └── stats.rs               # sysinfo probing logic
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
│       └── default.json
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE
└── README.md
```

---

### 4.3. Git Workflow & Branching Strategy
- **`main`**: Production-ready, stable releases.
- **`develop` / Feature Branches**: `feat/<feature-name>`, `fix/<bug-name>`, `chore/<task-name>`.

#### Commit Convention (Conventional Commits):
- `feat(backend): add sysinfo cpu and ram telemetry command`
- `feat(ui): implement StatCard and live gauge components`
- `fix(battery): handle null battery gracefully on desktop devices`
- `docs: update setup and tauri prerequisites in README`
- `ci: add GitHub Actions workflow for Tauri v2 build`

---

### 4.4. CI/CD GitHub Actions Workflow (`.github/workflows/ci.yml`)
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: windows-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Rust stable
        uses: dtolnay/rust-toolchain@stable

      - name: Rust Cache
        uses: swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Typecheck Frontend
        run: npm run build

      - name: Cargo Check
        run: cargo check --manifest-path src-tauri/Cargo.toml
```

---

### 4.5. Issue & PR Guidelines
- **Bug Reports:** Must include OS version, hardware model, whether device is laptop/desktop, and reproduction steps.
- **Pull Requests:** Must pass `cargo check` and `npm run build` without warnings, and adhere to minimal-diff philosophy.

---

## 5. Discovery Tasks (Before Writing Code)

1. **Verify Sysinfo & Battery API**:
   - Confirm `sysinfo` version compatible with Tauri v2 (e.g. `sysinfo = "0.33"`).
   - Verify CPU refresh delta mechanism (`refresh_cpu_usage()`).
   - Validate battery status API on Windows (`starship-battery` or `sysinfo` components).
2. **Confirm Target Platform**:
   - Primary: Windows 10/11 x64.
   - Cross-platform readiness: Linux & macOS compatibility maintained in Rust codebase.
3. **Scaffold Project**:
   - Initialize project via `npm create tauri-app@latest`.
   - Verify clean baseline build (`npm run tauri dev`) before introducing custom logic.

---

## 6. Task Breakdown

1. **Scaffold**: Initialize `FerroSense` with Tauri v2 + React + TypeScript + Vite.
2. **Rust Dependencies**: Configure `sysinfo = "0.33"` and `serde` in `src-tauri/Cargo.toml`.
3. **Backend Logic**: Implement `get_system_stats()` command returning:
   ```rust
   pub struct SystemStats {
       pub cpu_usage: f32,
       pub ram_used_gb: f32,
       pub ram_total_gb: f32,
       pub ram_used_pct: f32,
       pub disk_used_pct: f32,
       pub battery_pct: Option<f32>,
       pub is_charging: Option<bool>,
   }
   ```
4. **Tauri Registration**: Register command in `tauri::Builder` invoke handler.
5. **Frontend Hook**: Create `useSystemStats()` hook with 1500ms polling via `invoke('get_system_stats')`.
6. **Frontend UI**: Build `<Dashboard />` with 4 stat cards (CPU, RAM, Disk, Battery) and modern dark theme.
7. **Phase 1 Placeholder**: Clear label on thermal section: `"N/A — coming in Phase 1"`.
8. **Verification**: Validate telemetry values against Windows Task Manager.

---

## 7. Acceptance Criteria for POC Sign-Off

- [ ] App launches via `npm run tauri dev` without errors.
- [ ] All 4 stats update live every ~1.5s and align closely with Windows Task Manager.
- [ ] Battery fields display `"Desktop / No Battery"` gracefully without crashing when `battery_pct` is `null`.
- [ ] No hardcoded or mock data in the final build.
- [ ] GitHub setup files (`.gitignore`, `README.md`, CI workflow) are in place.

---

## 8. Phase 1 Preview (For Context Only)

Bundle LibreHardwareMonitor as a sidecar executable, run it with admin rights, poll its local WMI/JSON sensor feed from Rust, and surface CPU/GPU temperatures + fan RPM. Discovery and licensing evaluation will be conducted after POC sign-off.
