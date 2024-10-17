import AssemblyAITranscriber from '@/components/assemblyai-transcriber'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">AssemblyAI Transcriber</h1>
      <AssemblyAITranscriber />
    </main>
  )
}