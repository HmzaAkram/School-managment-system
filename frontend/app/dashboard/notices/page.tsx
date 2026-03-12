'use client';

import { notices } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Notice = typeof notices[0];

export default function NoticesPage() {
  const [allNotices, setAllNotices] = useState<Notice[]>(notices);
  const [filter, setFilter] = useState<string>('All');

  const filteredNotices = filter === 'All' ? allNotices : allNotices.filter((n) => n.category === filter);

  const handleDelete = (id: string) => {
    setAllNotices(allNotices.filter((n) => n.id !== id));
  };

  const categories = ['All', 'Event', 'Academic', 'Administrative'];
  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices & Announcements</h1>
          <p className="text-muted-foreground mt-1">Post and manage school announcements</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Notice
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === category
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-foreground hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg mt-1">
                    <Bell className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {notice.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          notice.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : notice.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {notice.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Posted by {notice.postedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 hover:bg-muted rounded-lg text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground leading-relaxed">{notice.content}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {new Date(notice.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No notices in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
