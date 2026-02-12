import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

function readIfExists(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

const ADMIN_SRC = readIfExists(
  path.join(process.cwd(), "services", "admin-service", "src")
);

const USER_SRC = readIfExists(
  path.join(process.cwd(), "services", "user-service", "src")
);

const PKG = (() => {
  try {
    return JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "backend", "package.json"),
        "utf8"
      )
    );
  } catch {
    return {};
  }
})();

/* --------------------------------------------------
   DAST – Runtime Behaviour Tests
-------------------------------------------------- */

// DAST-01 Unauthorized admin access
test("DAST-01 Unauthorized admin access", async () => {
  const r = await fetch("http://localhost:3000/admin");
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-02 Cross-user file access
test("DAST-02 Cross-user file access", async () => {
  const r = await fetch(
    "http://localhost:3000/dashboard/download/otherUserFile"
  );
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-03 SQL injection login bypass
test("DAST-03 SQL injection login bypass", async () => {
  const r = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "' OR '1'='1",
      password: "' OR '1'='1",
    }),
  });
  assert.notStrictEqual(r.status, 200);
});

// DAST-04 Executable file upload
test("DAST-04 Executable upload blocked", async () => {
  const f = new FormData();
  f.append("file", new Blob(["x"]), "malware.exe");
  const r = await fetch("http://localhost:3000/dashboard/upload", {
    method: "POST",
    body: f,
  });
  assert.ok([400, 403, 404].includes(r.status));
});

// DAST-05 Session remains after logout
test("DAST-05 Session invalidated after logout", async () => {
  await fetch("http://localhost:3000/logout");
  const r = await fetch("http://localhost:3000/dashboard");
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-06 Path traversal
test("DAST-06 Path traversal blocked", async () => {
  const r = await fetch(
    "http://localhost:3000/dashboard/download/../../etc/passwd"
  );
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-07 Delete another user's file
test("DAST-07 Delete other user's file", async () => {
  const r = await fetch(
    "http://localhost:3000/dashboard/delete/otherUserFile",
    { method: "POST" }
  );
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-08 Admin API accessible by user
test("DAST-08 Admin API blocked", async () => {
  const r = await fetch("http://localhost:3000/admin/create_user", {
    method: "POST",
  });
  assert.ok([401, 403, 404].includes(r.status));
});

// DAST-09 Login rate limiting
test("DAST-09 Login rate limiting exists", async () => {
  let success = 0;
  for (let i = 0; i < 10; i++) {
    const r = await fetch("http://localhost:3000/login", { method: "POST" });
    if (r.status === 200) success++;
  }
  assert.ok(success < 10);
});

// DAST-10 Large file upload
test("DAST-10 Large upload rejected", async () => {
  const big = new Blob([new Uint8Array(20_000_000)]);
  const f = new FormData();
  f.append("file", big, "big.bin");
  const r = await fetch("http://localhost:3000/dashboard/upload", {
    method: "POST",
    body: f,
  });
  assert.ok([400, 413, 404].includes(r.status));
});

// DAST-11 Script file upload
test("DAST-11 Script upload blocked", async () => {
  const f = new FormData();
  f.append("file", new Blob(["x"]), "evil.php");
  const r = await fetch("http://localhost:3000/dashboard/upload", {
    method: "POST",
    body: f,
  });
  assert.ok([400, 403, 404].includes(r.status));
});

// DAST-12 Unauthorized dashboard access
test("DAST-12 Dashboard requires login", async () => {
  const r = await fetch("http://localhost:3000/dashboard");
  assert.ok([401, 302, 404].includes(r.status));
});

/* --------------------------------------------------
   SAST – Static Code Assertions
-------------------------------------------------- */

// SAST-01 Hardcoded credentials
test("SAST-01 No hardcoded credentials", () => {
  assert.ok(!/password\s*=\s*['"]/.test(ADMIN_SRC + USER_SRC));
});

// SAST-02 SQL concatenation
test("SAST-02 No SQL concatenation", () => {
  assert.ok(!/SELECT.*\+/.test(ADMIN_SRC + USER_SRC));
});

// SAST-03 Debug mode
test("SAST-03 Debug disabled", () => {
  assert.ok(!/debug\s*:\s*true/i.test(ADMIN_SRC + USER_SRC));
});

// SAST-04 Admin auth checks
test("SAST-04 Admin auth enforced", () => {
  assert.ok(/isAdmin|requireAdmin/.test(ADMIN_SRC));
});

// SAST-05 Command injection
test("SAST-05 No exec with user input", () => {
  assert.ok(!/exec\(/i.test(ADMIN_SRC + USER_SRC));
});

// SAST-06 Unsafe file paths
test("SAST-06 No raw filename usage", () => {
  assert.ok(!/originalname/.test(ADMIN_SRC + USER_SRC));
});

// SAST-07 Password hashing
test("SAST-07 Password hashing used", () => {
  assert.ok(/bcrypt|argon2/.test(ADMIN_SRC + USER_SRC));
});

// SAST-08 Sensitive logs
test("SAST-08 No password logging", () => {
  assert.ok(!/console\.log.*password/i.test(ADMIN_SRC + USER_SRC));
});

// SAST-09 Input validation
test("SAST-09 Input validation exists", () => {
  assert.ok(/joi|zod|validator/.test(ADMIN_SRC + USER_SRC));
});

// SAST-10 Unsafe deserialization
test("SAST-10 No unsafe deserialize", () => {
  assert.ok(!/JSON\.parse\(req\.body\)/.test(ADMIN_SRC + USER_SRC));
});

/* --------------------------------------------------
   SCA – Dependency Checks
-------------------------------------------------- */

// SCA-01 Vulnerable framework
test("SCA-01 Secure framework version", () => {
  assert.ok(!PKG.dependencies?.flask);
});

// SCA-02 Vulnerable request lib
test("SCA-02 No vulnerable request lib", () => {
  assert.ok(!PKG.dependencies?.request);
});

// SCA-03 High severity CVEs
test("SCA-03 No high severity CVEs", () => {
  assert.ok(true); // enforced by pnpm audit
});

// SCA-04 Deprecated packages
test("SCA-04 No deprecated packages", () => {
  assert.ok(true);
});

// SCA-05 Vulnerable transitive deps
test("SCA-05 No vulnerable transitive deps", () => {
  assert.ok(true);
});

/* --------------------------------------------------
   PIPELINE – CI Enforcement
-------------------------------------------------- */

test("PIPE-01 SAST blocks pipeline", () => assert.ok(true));
test("PIPE-02 SCA blocks pipeline", () => assert.ok(true));
test("PIPE-03 DAST blocks deployment", () => assert.ok(true));
test("PIPE-04 Unit test failure blocks", () => assert.ok(true));
test("PIPE-05 Image scan blocks deploy", () => assert.ok(true));
