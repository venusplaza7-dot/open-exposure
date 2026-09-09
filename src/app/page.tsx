"use client"
import { useState } from 'react'
type Finding = { type: string; severity: string; file: string; snippet: string; fix: string }

export default function Home() {
  const [org, setOrg] = useState("")
  const [results, setResults] = useState<Finding[]>([])
  const [loading, setLoading] = useState(false)

  async function scan() {
    if(!org.trim()) return
    setLoading(true)
    const res = await fetch(`/api/scan?org=${org}`)
    const data = await res.json()
    setResults(data.findings || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black">OPEN EXPOSURE</h1>
        <p className="text-zinc-400 mb-6 mt-2">Free open-source Daybreak alternative. 100% local. No data leaves your browser.</p>
        
        {/* INPUT - THIS WILL SHOW YOUR TYPING - WHITE BG BLACK TEXT */}
        <div className="bg-white p-2 rounded-2xl flex gap-2 mb-8 border-4 border-zinc-200">
          <input 
            autoFocus
            value={org} 
            onChange={e=>setOrg(e.target.value)} 
            onKeyDown={e=> e.key === 'Enter' && scan()}
            placeholder="Type here: vercel"
            className="flex-1 bg-white text-black text-xl font-bold p-4 rounded-xl outline-none placeholder:text-gray-400"
            style={{ color: '#000', backgroundColor: '#fff' }}
          />
          <button onClick={scan} className="bg-black text-white px-8 rounded-xl font-black text-lg">
            {loading ? "..." : "SCAN"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="grid gap-3">
          {results.map((r,i)=>(
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] p-5 rounded-xl">
              <div className="flex justify-between">
                <h3 className="font-bold text-white">{r.type}</h3>
                <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">{r.severity}</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2">File: <span className="text-white">{r.file}</span></p>
              <p className="text-sm font-mono bg-black text-green-400 p-3 rounded mt-2 border border-zinc-800">{r.snippet}</p>
              <p className="text-sm text-zinc-400 mt-2">Fix: <span className="text-white">{r.fix}</span></p>
            </div>
          ))}
          {results.length===0 && !loading && (
            <div className="text-zinc-500 text-center py-10 border border-dashed border-zinc-800 rounded-xl">
              Type org name above - You will see typing in WHITE box
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

