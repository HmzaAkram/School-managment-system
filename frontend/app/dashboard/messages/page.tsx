'use client';

import { messages as initialMessages } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(initialMessages[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter(
    (m) =>
      m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      console.log('Reply sent:', replyText);
      setReplyText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">School communications and messages</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Messages */}
            <div className="space-y-2">
              {filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedMessage?.id === msg.id
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Mail
                      size={18}
                      className={selectedMessage?.id === msg.id ? 'text-white' : 'text-primary'}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm truncate ${
                          selectedMessage?.id === msg.id ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {msg.from}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          selectedMessage?.id === msg.id
                            ? 'text-blue-100'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {msg.subject}
                      </p>
                    </div>
                    {!msg.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail */}
        {selectedMessage && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {selectedMessage.from.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedMessage.from}</p>
                  <p className="text-sm text-muted-foreground">{selectedMessage.fromRole}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-foreground leading-relaxed">{selectedMessage.message}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(selectedMessage.date).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button
                  className="gap-2"
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  <Send size={18} />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
