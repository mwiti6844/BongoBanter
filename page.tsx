import AssemblyAITranscriber from '@/components/assemblyai-transcriber'

export default function TranscriptionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Audio Transcription</h1>
      <AssemblyAITranscriber />
    </div>
  )
}