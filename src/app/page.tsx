"use client"
import { useState } from 'react'
type Finding = { type: string; severity: string; file: string; snippet: string; fix: string }

export default function Home() {
  const [org, setOrg] = useState("vercel")
  const [results, setResults] = useState<Finding[]>([])
  const [loading, setLoading] = useState(false)

  async function scan() {
    setLoading(true)
    const res = await fetch(`/api/scan?org=${org}`)
    const data = await res.json()
    setResults(data.findings || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 rounded-2xl mb-6">
          <h1 className="text-5xl font-black tracking-tighter">OPEN EXPOSURE</h1>
          <p className="text-zinc-400 mt-2">Free open-source Daybreak alternative. 100% local. No data leaves your browser.</p>
        </div>
        
        <div className="flex gap-3 mb-8">
          <input value={org} onChange={e=>setOrg(e.target.value)} className="flex-1 bg-[#111] border border-[#333] text-white text-lg p-4 rounded-xl focus:border-[#00FF41] focus:outline-none placeholder:text-zinc-600" placeholder="vercel" />
          <button onClick={scan} className="bg-white text-black px-8 rounded-xl font-black hover:bg-zinc-200 transition">{loading ? "..." : "SCAN"}</button>
        </div>

        <div className="grid gap-4">
          {results.map((r,i)=>(
            <div key={i} className="bg-[#111] border border-[#222] p-6 rounded-xl hover:border-zinc-600 transition-all">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-black text-white tracking-widest text-sm">{r.type}</h3>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-yellow-400 text-black">{r.severity}</span>
              </div>
              <p className="text-sm text-zinc-300">File: <span className="text-white font-bold">{r.file}</span></p>
              <code className="block mt-3 bg-black border border-zinc-800 p-3 rounded-lg text-[#00FF41] text-sm">{r.snippet}</code>
              <p className="text-sm text-zinc-400 mt-3">Fix: <span className="text-white">{r.fix}</span></p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}









