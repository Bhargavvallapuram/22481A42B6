async function Log(stack, level, packageName, message) {
  const API_URL = "http://20.244.56.144/evaluation-service/logs";
  const stacks = ["backend", "frontend"];
  const levels = ["debug", "info", "warn", "error", "fatal"];
  const backendPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
  const frontendPackages = ["component", "hook", "page", "state", "style"];
  const sharedPackages = ["auth", "config", "middleware", "utils"];

  stack = stack.toLowerCase();
  level = level.toLowerCase();
  packageName = packageName.toLowerCase();

  if (!stacks.includes(stack) || !levels.includes(level)) return;
  const validPackages = stack === "backend" ? backendPackages.concat(sharedPackages) : frontendPackages.concat(sharedPackages);
  if (!validPackages.includes(packageName)) return;

  const payload = { stack, level, package: packageName, message };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) console.log("Log created:", data);
    else console.error("Log error:", data);
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = Log;