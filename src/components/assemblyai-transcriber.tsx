'use client'

import { useState, useRef } from 'react'
import { AssemblyAI } from 'assemblyai'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Link, File } from 'lucide-react'

// Initialize the AssemblyAI client
// In a real application, use an environment variable for the API key
const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY || '97d850f3c3934f08ae4dc91dd23e39de'
})

export default function AssemblyAITranscriber() {
  const [audioSource, setAudioSource] = useState<'url' | 'file'>('url')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTranscribe = async () => {
    setIsTranscribing(true)
    setError(null)
    setTranscription('')

    try {
      let audio: string | File
      if (audioSource === 'url') {
        audio = audioUrl
      } else if (audioFile) {
        audio = audioFile
      } else {
        throw new Error('No audio source provided')
      }

      const params = {
        audio,
        speaker_labels: true
      }

      const transcript = await client.transcripts.transcribe(params)

      if (transcript.utterances) {
        const formattedTranscript = transcript.utterances.map(utterance => 
          `Speaker ${utterance.speaker}: ${utterance.text}`
        ).join('\n')
        setTranscription(formattedTranscript)
      } else {
        setTranscription('Transcription completed, but no utterances were found.')
      }
    } catch (err) {
      setError('Failed to transcribe. Please check the audio source and try again.')
      console.error(err)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AssemblyAI Transcription Tool</CardTitle>
        <CardDescription>Enter a URL or upload an audio file for transcription</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" onValueChange={(value) => setAudioSource(value as 'url' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <div className="flex space-x-2">
              <Input 
                type="url" 
                placeholder="https://example.com/audio.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="file">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="audio-file">Upload Audio File</Label>
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {audioFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {audioFile.name}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4 space-y-4">
          <Button 
            onClick={handleTranscribe} 
            disabled={isTranscribing || (audioSource === 'url' ? !audioUrl : !audioFile)}
            className="w-full"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                {audioSource === 'url' ? <Link className="mr-2 h-4 w-4" /> : <File className="mr-2 h-4 w-4" />}
                Transcribe {audioSource === 'url' ? 'URL' : 'File'}
              </>
            )}
          </Button>
          <Textarea 
            placeholder="Transcription will appear here..." 
            value={transcription}
            readOnly
            className="h-60"
          />
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}