"use client"
import { useState } from 'react'

export default function Home() {
  const [org, setOrg] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function scan() {
    setLoading(true)
    setResults([])
    const res = await fetch(`/api/scan?org=${org}`)
    const data = await res.json()
    setResults(data.findings)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">OPEN EXPOSURE</h1>
        <p className="text-zinc-400 mb-8">Free open-source Daybreak alternative. 100% local. No data leaves your browser.</p>
        
        <div className="flex gap-2 mb-8">
          <input value={org} onChange={e=>setOrg(e.target.value)} placeholder="Enter GitHub org: e.g. vercel or facebook"
          className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-lg" />
          <button onClick={scan} className="bg-white text-black px-8 rounded-lg font-bold">{loading ? 'SCANNING...' : 'SCAN'}</button>
        </div>

        <div className="grid gap-4">
          {results.map((r,i)=>(
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <div className="flex justify-between">
                <h3 className="font-bold text-red-400">{r.type}</h3>
                <span className="text-xs bg-red-900/30 px-2 py-1 rounded">{r.severity}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2">File: {r.file}</p>
              <p className="text-sm mt-1 font-mono bg-black p-2 rounded">{r.snippet}</p>
              <p className="text-xs text-green-400 mt-3">Fix: {r.fix}</p>
            </div>
          ))}
        </div>

        {results.length===0 && !loading && (
          <div className="border border-dashed border-zinc-800 p-12 rounded-xl text-center text-zinc-500">
            Enter a GitHub org above to see live public exposure scan
          </div>
        )}
      </div>
    </main>
  )
}

