import { NextRequest, NextResponse } from 'next/server'

interface ScanFinding {
  type: 'API_KEY' | 'EXPOSED_ENDPOINT' | 'SECRET'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  file: string
  snippet: string
  fix: string
}

interface ScanResponse {
  org: string
  findings: ScanFinding[]
  count: number
  query: string
}

export async function GET(req: NextRequest): Promise<NextResponse<ScanResponse>> {
  const org = req.nextUrl.searchParams.get('org') || 'vercel'

  // Real GitHub API would be here - This mock proves TS structure for portfolio
  const findings: ScanFinding[] = [
    {
      type: 'API_KEY',
      severity: 'MEDIUM',
      file: `${org}/.env.example`,
      snippet: `GITHUB_TOKEN=ghp_xxxx in ${org}`,
      fix: 'Move to env vars, add to .gitignore'
    },
    {
      type: 'EXPOSED_ENDPOINT',
      severity: 'LOW',
      file: `${org}/api/route.ts`,
      snippet: `/api/scan?org=${org} public endpoint`,
      fix: 'Add auth middleware'
    }
  ]

  return NextResponse.json({
    org,
    findings,
    count: findings.length,
    query: `SELECT * FROM exposures WHERE org = '${org}' ORDER BY severity DESC`
  })
}
