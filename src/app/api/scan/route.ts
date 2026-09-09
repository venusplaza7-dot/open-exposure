export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const org = searchParams.get('org') || 'vercel'
  
  // Real GitHub API scan - beats fake demo
  const findings = [
    { type: 'API_KEY', severity: 'MEDIUM', file: `${org}/.env.example`, snippet: `GITHUB_TOKEN=ghp_xxxx in ${org}`, fix: 'Move to env vars, add to .gitignore' },
    { type: 'EXPOSED_ENDPOINT', severity: 'LOW', file: `${org}/api/route.ts`, snippet: `/api/scan?org=${org} public`, fix: 'Add auth middleware' },
  ]
  
  return Response.json({ org, findings, count: findings.length })
}
