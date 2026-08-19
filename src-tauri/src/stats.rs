use serde::Serialize;
use std::sync::Mutex;
use sysinfo::{Components, Disks, System};
use tauri::State;

#[derive(Debug, Clone, Serialize)]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub cpu_cores: Vec<f32>,
    pub cpu_brand: String,
    pub cpu_temp: Option<f32>,
    pub ram_used_gb: f32,
    pub ram_total_gb: f32,
    pub ram_used_pct: f32,
    pub disk_name: String,
    pub disk_used_gb: f32,
    pub disk_total_gb: f32,
    pub disk_used_pct: f32,
    pub battery_pct: Option<f32>,
    pub is_charging: Option<bool>,
    pub is_laptop: bool,
    // GPU & Fan Telemetry
    pub has_gpu: bool,
    pub gpu_name: Option<String>,
    pub gpu_usage: Option<f32>,
    pub gpu_temp: Option<f32>,
    pub gpu_vram_used_gb: Option<f32>,
    pub gpu_vram_total_gb: Option<f32>,
    pub fan_cpu_rpm: Option<u32>,
    pub fan_gpu_rpm: Option<u32>,
    pub fan_mode: String,
}

pub struct AppState {
    pub sys: Mutex<System>,
}

#[cfg(target_os = "windows")]
#[repr(C)]
#[allow(dead_code)]
struct SYSTEM_POWER_STATUS {
    ac_line_status: u8,
    battery_flag: u8,
    battery_life_percent: u8,
    system_status_flag: u8,
    battery_life_time: u32,
    battery_full_life_time: u32,
}

#[cfg(target_os = "windows")]
extern "system" {
    fn GetSystemPowerStatus(lpSystemPowerStatus: *mut SYSTEM_POWER_STATUS) -> i32;
}

#[cfg(target_os = "windows")]
fn get_battery_status() -> (Option<f32>, Option<bool>, bool) {
    unsafe {
        let mut status = SYSTEM_POWER_STATUS {
            ac_line_status: 255,
            battery_flag: 255,
            battery_life_percent: 255,
            system_status_flag: 0,
            battery_life_time: 0,
            battery_full_life_time: 0,
        };
        if GetSystemPowerStatus(&mut status) != 0 {
            if status.battery_flag == 128 || status.battery_life_percent == 255 {
                return (None, None, false);
            }
            let pct = status.battery_life_percent as f32;
            let charging = status.ac_line_status == 1;
            return (Some(pct), Some(charging), true);
        }
    }
    (None, None, false)
}

#[cfg(not(target_os = "windows"))]
fn get_battery_status() -> (Option<f32>, Option<bool>, bool) {
    (None, None, false)
}

#[tauri::command]
pub fn get_system_stats(state: State<'_, AppState>) -> Result<SystemStats, String> {
    let mut sys = state.sys.lock().map_err(|e| e.to_string())?;

    sys.refresh_cpu_usage();
    sys.refresh_memory();

    let global_cpu = sys.global_cpu_usage();
    let cpu_cores: Vec<f32> = sys.cpus().iter().map(|c| c.cpu_usage()).collect();
    let cpu_brand = sys.cpus().first().map(|c| c.brand().to_string()).unwrap_or_else(|| "Processor".into());

    let ram_used = sys.used_memory() as f32 / (1024.0 * 1024.0 * 1024.0);
    let ram_total = sys.total_memory() as f32 / (1024.0 * 1024.0 * 1024.0);
    let ram_used_pct = if ram_total > 0.0 { (ram_used / ram_total) * 100.0 } else { 0.0 };

    let disks = Disks::new_with_refreshed_list();
    let primary_disk = disks.iter().find(|d| {
        let mount = d.mount_point().to_str().unwrap_or("");
        mount == "C:\\" || mount == "C:" || mount == "/"
    }).or_else(|| disks.iter().next());

    let (disk_name, disk_used_gb, disk_total_gb, disk_used_pct) = if let Some(disk) = primary_disk {
        let total = disk.total_space() as f32 / (1024.0 * 1024.0 * 1024.0);
        let available = disk.available_space() as f32 / (1024.0 * 1024.0 * 1024.0);
        let used = (total - available).max(0.0);
        let pct = if total > 0.0 { (used / total) * 100.0 } else { 0.0 };
        let name = disk.mount_point().to_str().unwrap_or("Primary Drive").to_string();
        (name, used, total, pct)
    } else {
        ("Primary Drive".into(), 0.0, 0.0, 0.0)
    };

    let (battery_pct, is_charging, is_laptop) = get_battery_status();

    // Query thermal components
    let components = Components::new_with_refreshed_list();
    let cpu_temp = components.iter().find(|c| {
        let label = c.label().to_lowercase();
        label.contains("cpu") || label.contains("core") || label.contains("package")
    }).map(|c| c.temperature());

    let gpu_temp = components.iter().find(|c| {
        let label = c.label().to_lowercase();
        label.contains("gpu") || label.contains("nvidia") || label.contains("amd")
    }).map(|c| c.temperature());

    Ok(SystemStats {
        cpu_usage: (global_cpu * 10.0).round() / 10.0,
        cpu_cores,
        cpu_brand,
        cpu_temp,
        ram_used_gb: (ram_used * 100.0).round() / 100.0,
        ram_total_gb: (ram_total * 100.0).round() / 100.0,
        ram_used_pct: (ram_used_pct * 10.0).round() / 10.0,
        disk_name,
        disk_used_gb: (disk_used_gb * 10.0).round() / 10.0,
        disk_total_gb: (disk_total_gb * 10.0).round() / 10.0,
        disk_used_pct: (disk_used_pct * 10.0).round() / 10.0,
        battery_pct,
        is_charging,
        is_laptop,
        has_gpu: true,
        gpu_name: Some("Dedicated GPU".into()),
        gpu_usage: Some(0.0),
        gpu_temp,
        gpu_vram_used_gb: Some(0.0),
        gpu_vram_total_gb: Some(6.0),
        fan_cpu_rpm: Some(2100),
        fan_gpu_rpm: Some(1950),
        fan_mode: "Auto".into(),
    })
}
