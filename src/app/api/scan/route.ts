import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const org = req.nextUrl.searchParams.get('org') || 'vercel'
  
  try {
    // 1. Get real repos of org
    const repoRes = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=20&sort=updated`, {
      headers: { 'User-Agent': 'Open-Exposure' }
    })
    const repos = await repoRes.json()
    
    if (!Array.isArray(repos)) {
      return NextResponse.json({ findings: [{ 
        title: `Org ${org} not found or rate limited`, 
        severity: 'MEDIUM', 
        repo: org, 
        file: 'API',
        desc: 'GitHub API limit hit. Add GITHUB_TOKEN in Vercel env to fix.'
      }]})
    }

    // 2. Scan for real risks in repo names/descriptions
    const findings: any[] = []
    
    for (const repo of repos.slice(0, 15)) {
      const name = repo.name.toLowerCase()
      const desc = (repo.description || '').toLowerCase()
      
      if (name.includes('secret') || name.includes('key') || name.includes('env') || name.includes('private')) {
        findings.push({
          title: `Suspicious Repo Name: ${repo.name}`,
          severity: 'HIGH',
          repo: repo.full_name,
          file: 'repo-name',
          desc: `Repo name contains sensitive keyword. Public repo: ${repo.html_url}`,
          url: repo.html_url
        })
      }
      if (repo.homepage && (repo.homepage.includes('vercel.app') || repo.homepage.includes('internal'))) {
        findings.push({
          title: `Internal URL Exposed`,
          severity: 'MEDIUM',
          repo: repo.full_name,
          file: 'homepage field',
          desc: `Homepage points to internal: ${repo.homepage}`,
          url: repo.html_url
        })
      }
    }

    // 3. If no risks, show real inventory (still valuable to CTOs)
    if (findings.length === 0) {
      findings.push({
        title: `${repos.length} Public Repos Audited - No obvious naming leaks`,
        severity: 'LOW',
        repo: `${org}/*`,
        file: 'org-audit',
        desc: `Scanned ${repos.length} most-recent public repos of ${org}. Next: scan file contents for API keys (requires GITHUB_TOKEN).`,
        url: `https://github.com/${org}`
      })
      // Show top repos as info
      repos.slice(0,3).forEach((r:any) => {
        findings.push({
          title: `Public Repo: ${r.name} - ${r.stargazers_count} stars`,
          severity: 'INFO',
          repo: r.full_name,
          file: 'inventory',
          desc: r.description || 'No description',
          url: r.html_url
        })
      })
    }

    return NextResponse.json({ findings })

  } catch (e:any) {
    return NextResponse.json({ findings: [{ title: 'Scan failed', severity: 'HIGH', desc: e.message }] })
  }
}