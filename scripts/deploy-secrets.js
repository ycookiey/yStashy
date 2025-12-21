const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load .env.local
const envConfig = dotenv.config({ path: '.env.local' }).parsed;

if (!envConfig) {
  console.error('Could not load .env.local');
  process.exit(1);
}

const projectName = 'ystashy';

// Add Cloudflare specific build config
envConfig['NPM_CONFIG_LEGACY_PEER_DEPS'] = 'true';

console.log(`Deploying secrets to Cloudflare Pages project: ${projectName}`);

for (const [key, value] of Object.entries(envConfig)) {
  if (!value) continue; // Skip empty values

  console.log(`Setting secret: ${key}`);
  try {
    // Pipe the value to stdin to avoid showing it in process list / command line
    // PowerShell compatibility: Using echo logic might be tricky across platforms, 
    // but Node's execSync with input option is cleaner.
    
    execSync(`npx wrangler pages secret put ${key} --project-name ${projectName}`, {
      input: value,
      stdio: ['pipe', 'inherit', 'inherit'], // pipe stdin, inherit stdout/stderr
      shell: 'powershell.exe' // Explicitly use PowerShell for Windows
    });
    
    console.log(`✅ ${key} set successfully.`);
  } catch (error) {
    console.error(`❌ Failed to set ${key}:`, error.message);
  }
}

console.log('All secrets deployment tasks finished.');
