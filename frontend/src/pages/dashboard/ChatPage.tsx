import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Bot, User, FileText, Trash2 } from "lucide-react"
import { useChatStore, useProjectStore } from "@/stores"
import { TypewriterText } from "@/components/typewriter-text"

export default function ChatPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const {
    messages,
    isLoading,
    isSending,
    streamingContent,
    progressMessage,
    error,
    fetchHistory,
    sendMessage,
    clearHistory,
    clearError,
  } = useChatStore()

  const [input, setInput] = useState("")
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(0)

  // Track when a new assistant message is added to animate it
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === "assistant") {
        setAnimatingMessageId(lastMessage.id)
      }
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages])

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      fetchHistory(projectId)
    }
  }, [projectId, fetchProject, fetchHistory])

  useEffect(() => {
    // Scroll to bottom when new messages arrive or streaming content updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, progressMessage, animatingMessageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending || !projectId) return

    const message = input.trim()
    setInput("")
    await sendMessage(projectId, message)
  }

  const handleClearHistory = async () => {
    if (projectId && confirm("Clear all chat history?")) {
      await clearHistory(projectId)
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.title || "Project", href: `/dashboard/projects/${projectId}/documents` },
        { label: "Q&A Chat" },
      ]}
    >
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Q&A Chat</h1>
            <p className="text-muted-foreground">
              Ask questions about your project documents.
            </p>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Project Assistant
            </CardTitle>
            <CardDescription>
              Powered by RAG - answers are grounded in your uploaded documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-3/4" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Start a conversation</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Ask questions about your project requirements, and I'll
                    find answers from your uploaded documents.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What are the main requirements?")}
                    >
                      What are the main requirements?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Tell me about the authentication requirements")}
                    >
                      Authentication requirements
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What are the performance requirements?")}
                    >
                      Performance requirements
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-3 max-w-[60%] ${message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.role === "assistant" && animatingMessageId === message.id ? (
                            <TypewriterText
                              text={message.content}
                              speed={50}
                              onComplete={() => setAnimatingMessageId(null)}
                            />
                          ) : (
                            message.content
                          )}
                        </p>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && animatingMessageId !== message.id && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium mb-2 opacity-70">Sources:</p>
                            <div className="space-y-1">
                              {message.sources.map((source, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs opacity-70"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>{source.documentName}</span>
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                    {Math.round(source.relevanceScore * 100)}% match
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Streaming content or typing indicator */}
                  {isSending && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg px-4 py-3 bg-muted max-w-[50%]">
                        {streamingContent ? (
                          <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                        ) : progressMessage ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
                            </div>
                            <span className="text-sm text-muted-foreground">{progressMessage}</span>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {error && !isSending && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg px-4 py-3 bg-destructive/10 border border-destructive/20 max-w-[60%]">
                        <p className="text-sm text-destructive">{error}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={clearError}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your project..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSending}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isSending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
