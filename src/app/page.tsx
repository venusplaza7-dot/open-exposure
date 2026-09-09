"use client"
import { useState } from 'react'

interface Finding {
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  file: string
  snippet: string
  fix: string
}

export default function Home() {
  const [org, setOrg] = useState("")
  const [results, setResults] = useState<Finding[]>([])
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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">OPEN EXPOSURE</h1>
        <p className="text-zinc-400 mb-8 text-lg">Free open-source Daybreak alternative. 100% local. No data leaves your browser.</p>
        
        <div className="flex gap-3 mb-8">
          <input 
            value={org} 
            onChange={e=>setOrg(e.target.value)} 
            placeholder="Enter GitHub org (e.g. vercel)" 
            className="flex-1 bg-[#141414] border border-[#333] text-white placeholder:text-zinc-500 p-4 rounded-xl focus:border-white focus:outline-none text-base" 
          />
          <button onClick={scan} className="bg-white text-black px-8 rounded-xl font-bold hover:bg-zinc-200 transition text-base">
            {loading ? "..." : "SCAN"}
          </button>
        </div>

        <div className="grid gap-4">
          {results.map((r,i)=>(
            <div key={i} className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-xl hover:border-[#404040] transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-lg tracking-wide">{r.type}</h3>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  r.severity === 'CRITICAL' ? 'bg-red-500 text-white border-red-400' :
                  r.severity === 'HIGH' ? 'bg-orange-500 text-black border-orange-400' :
                  r.severity === 'MEDIUM' ? 'bg-yellow-400 text-black border-yellow-300' :
                  'bg-green-400 text-black border-green-300'
                }`}>{r.severity}</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2 font-mono">File: <span className="text-white">{r.file}</span></p>
              <p className="text-sm mt-3 font-mono bg-black p-3 rounded-lg border border-zinc-800 text-zinc-200 overflow-x-auto">{r.snippet}</p>
              <p className="text-sm text-green-400 mt-3 font-medium">Fix: <span className="text-green-300">{r.fix}</span></p>
            </div>
          ))}
        </div>

        {results.length===0 && !loading && (
          <div className="border border-dashed border-zinc-700 p-12 rounded-xl text-center text-zinc-400 mt-8 bg-[#141414]/50">
            <p className="text-white font-medium mb-1">Enter a GitHub org above to see live public exposure scan</p>
            <p className="text-sm">100% local • Real GitHub API • No fake demo</p>
          </div>
        )}
      </div>
    </main>
  )
}
