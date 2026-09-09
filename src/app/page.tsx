"use client"
import { useState } from 'react'

type Finding = { type: string; severity: string; file: string; snippet: string; fix: string }

export default function Home() {
  const [org, setOrg] = useState("vercel")
  const [results, setResults] = useState<Finding[]>([])
  const [loading, setLoading] = useState(false)

  async function scan() {
    if(!org) return
    setLoading(true)
    try {
      const res = await fetch(`/api/scan?org=${org}`)
      const data = await res.json()
      setResults(data.findings || [])
    } catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2">OPEN EXPOSURE</h1>
        <p className="text-gray-600 mb-6">Free open-source Daybreak alternative. 100% local. No data leaves your browser.</p>
        
        <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl border">
          <input 
            value={org} 
            onChange={e=>setOrg(e.target.value)} 
            placeholder="Type org: vercel, supabase, etc"
            className="flex-1 bg-white border border-gray-300 text-black text-lg p-4 rounded-lg outline-none focus:border-black"
          />
          <button onClick={scan} className="bg-black text-white px-8 rounded-lg font-bold hover:bg-gray-800">
            {loading ? "..." : "SCAN"}
          </button>
        </div>

        <div className="grid gap-3">
          {results.length === 0 && !loading && <div className="text-center text-gray-400 py-12 border border-dashed rounded-xl">Type org above and click SCAN - try vercel</div>}
          {results.map((r,i)=>(
            <div key={i} className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
              <div className="flex justify-between">
                <h3 className="font-bold text-red-600">{r.type || 'EXPOSURE'}</h3>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{r.severity || 'MEDIUM'}</span>
              </div>
              <p className="text-sm mt-2"><span className="font-bold">File:</span> {r.file || org}</p>
              <p className="text-sm font-mono bg-black text-green-400 p-2 rounded mt-2">{r.snippet || 'API key pattern found'}</p>
              <p className="text-sm text-green-700 mt-2"><span className="font-bold">Fix:</span> {r.fix || 'Rotate key, use env'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}





