import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">Credex Audit</span>
        <Badge variant="outline">Free Tool</Badge>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Badge className="mb-6 bg-zinc-100 text-zinc-700 hover:bg-zinc-100">
          No signup required
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
          Is your startup overpaying for AI tools?
        </h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-xl mx-auto">
          Get a free instant audit of your AI tool spend. See exactly where you are overspending and how much you could save every month.
        </p>
        <Link href="/audit/new">
          <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-700 px-8 py-6 text-lg rounded-xl">
            Audit My AI Spend — Free
          </Button>
        </Link>
        <p className="text-sm text-zinc-400 mt-4">Takes 2 minutes. No login needed.</p>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Enter your tools', desc: 'Tell us what AI tools your team pays for, which plan, and how many seats.' },
            { step: '2', title: 'Get instant audit', desc: 'Our engine checks every tool against current pricing and your actual usage pattern.' },
            { step: '3', title: 'See your savings', desc: 'Get a clear breakdown of where you are overspending and what to do about it.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-8 text-center text-sm text-zinc-400">
        Built by Credex · <a href="https://credex.rocks" className="underline">credex.rocks</a>
      </footer>
    </main>
  )
}