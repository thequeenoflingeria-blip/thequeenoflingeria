const { execSync } = require('child_process');

const envVars = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://sagyyonscnjrahpfjeen.supabase.co' },
  { name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', value: 'sb_publishable_uCmSZy-GRXXtF2JQtP8DIw_MD0mZ1p0' },
  { name: 'NEXT_PUBLIC_SANITY_PROJECT_ID', value: 'vjerk6i1' },
  { name: 'NEXT_PUBLIC_SANITY_DATASET', value: 'production' },
  { name: 'SANITY_API_TOKEN', value: 'skUoMjTsTVPVso0s3QxvKVnmsLkxI20L3CPgNmdzhPk2azQK6kGnicQVvZeBNq2Ca6P27Caj0Z4KC9ZzUa51DLxweihIh6PDfWTuDP1GujpW3fCAaRDi7vDQghko0xzqQRBStDWc4IVN4ASWnIc92xowjeg9Ul3f3c4TPzpKD3DJKPJVKBAS' },
  { name: 'ADMIN_USERNAME', value: 'admin' },
  { name: 'ADMIN_PASSWORD', value: 'Queen@2025!Secure' },
  { name: 'ADMIN_SESSION_SECRET', value: 'ql-super-secret-32-chars-minimum!!' },
];

for (const env of envVars) {
  try {
    console.log(`Adding ${env.name}...`);
    execSync(`echo "${env.value}" | npx vercel env add ${env.name} production`, {
      stdio: ['pipe', 'inherit', 'inherit'],
      input: env.value
    });
    console.log(`✅ Added ${env.name}`);
  } catch (e) {
    console.log(`⚠️ ${env.name} might already exist or failed`);
  }
}

console.log('Done! Now redeploying...');
execSync('npx vercel --prod --yes', { stdio: 'inherit' });
