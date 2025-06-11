"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Search, Mail, CheckCircle, XCircle } from "lucide-react"

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [readFilter, setReadFilter] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const router = useRouter()
  const { supabase, user, loading: userLoading } = useSupabase()

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        if (!userLoading) {
          router.push("/login?redirect=/admin/messages")
        }
        return
      }

      try {
        const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

        if (error) throw error

        if (!data.is_admin) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
      }
    }

    if (!userLoading) {
      checkAdmin()
    }
  }, [supabase, user, userLoading, router])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return

      try {
        let query = supabase.from("contact_messages").select("*")

        if (readFilter !== "all") {
          query = query.eq("is_read", readFilter === "read")
        }

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,message.ilike.%${searchQuery}%`)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error

        setMessages(data || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMessages()
    }
  }, [supabase, user, readFilter, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by the useEffect dependency
  }

  const handleMarkAsRead = async (id, isRead) => {
    try {
      const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id)

      if (error) throw error

      setMessages(messages.map((message) => (message.id === id ? { ...message, is_read: isRead } : message)))

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: isRead })
      }
    } catch (error) {
      console.error("Error updating message status:", error)
      alert("Failed to update message status. Please try again.")
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error

      setMessages(messages.filter((message) => message.id !== id))

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      alert("Failed to delete message. Please try again.")
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search messages..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md">
                    Search
                  </button>
                </form>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center">
                  <label htmlFor="read-filter" className="mr-2 text-sm font-medium text-gray-700">
                    Filter:
                  </label>
                  <select
                    id="read-filter"
                    value={readFilter}
                    onChange={(e) => setReadFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[600px]">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No messages found.</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <li
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? "bg-gray-50" : ""
                        } ${!message.is_read ? "font-semibold" : ""}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 mt-1 ${!message.is_read ? "text-amber-500" : "text-gray-400"}`}
                          >
                            <Mail className="h-5 w-5" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900 line-clamp-1">{message.name}</p>
                            <p className="text-xs text-gray-500">{message.email}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h2 className="text-lg font-bold">Message Details</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)}
                      className={`p-2 rounded-full ${
                        selectedMessage.is_read ? "text-gray-500 hover:bg-gray-100" : "text-amber-500 hover:bg-amber-50"
                      }`}
                      title={selectedMessage.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedMessage.is_read ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-50"
                      title="Delete message"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500">From</h3>
                    <p className="text-lg">{selectedMessage.name}</p>
                    <p className="text-gray-600">{selectedMessage.email}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{selectedMessage.message}</div>
                  </div>

                  <div className="mt-8">
                    <a href={`mailto:${selectedMessage.email}`} className="btn-primary inline-flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold mb-2">No Message Selected</h2>
                <p className="text-gray-500">Select a message from the list to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
