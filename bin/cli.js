#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const REPO_URL = "https://github.com/udayanwalvekar/clearshot.git";
const INSTALL_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".claude",
  "skills",
  "clearshot"
);

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", ...opts });
}

function main() {
  console.log("\nclearshot - structured screenshot intelligence\n");

  try {
    // Detect and remove broken symlinks (including circular ones that cause ELOOP)
    try {
      const lstat = fs.lstatSync(INSTALL_DIR);
      if (lstat.isSymbolicLink() && !fs.existsSync(INSTALL_DIR)) {
        console.log("broken symlink detected at " + INSTALL_DIR + ", removing...");
        fs.unlinkSync(INSTALL_DIR);
      }
    } catch (e) {
      // ENOENT means path doesn't exist at all — that's fine, fresh install
      if (e.code !== "ENOENT") {
        // ELOOP or other errors mean a broken/circular symlink — remove it
        console.log("broken symlink detected at " + INSTALL_DIR + " (" + e.code + "), removing...");
        try { fs.unlinkSync(INSTALL_DIR); } catch (_) {}
      }
    }

    if (fs.existsSync(path.join(INSTALL_DIR, ".git"))) {
      console.log("existing installation found, updating...");
      run("git pull", { cwd: INSTALL_DIR });
      console.log("running setup...");
      run("./setup", { cwd: INSTALL_DIR });
    } else {
      console.log("installing to " + INSTALL_DIR + "...");
      fs.mkdirSync(path.dirname(INSTALL_DIR), { recursive: true });
      run(`git clone ${REPO_URL} "${INSTALL_DIR}"`);
      console.log("running setup...");
      run("./setup", { cwd: INSTALL_DIR });
    }

    console.log("\ndone. clearshot is ready.");
    console.log(
      "activates automatically when you share a UI screenshot.\n"
    );
  } catch (err) {
    console.error("\ninstallation failed:", err.message);
    process.exit(1);
  }
}

main();
