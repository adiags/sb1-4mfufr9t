import React, { useState, useEffect } from 'react';
import { Clock, ArrowUp, ArrowDown, Search, ImageIcon, Trash2, FileText, Calendar, Eye } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'encode' | 'decode';
  filename: string;
  timestamp: string;
  messageLength: number;
  previewUrl: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'encode' | 'decode'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  // Demo data
  useEffect(() => {
    const demoHistory: HistoryItem[] = [
      {
        id: '1',
        type: 'encode',
        filename: 'vacation-photo.jpg',
        timestamp: '2025-04-18T14:30:00Z',
        messageLength: 156,
        previewUrl: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: '2',
        type: 'decode',
        filename: 'secret-message.png',
        timestamp: '2025-04-17T09:15:00Z',
        messageLength: 89,
        previewUrl: 'https://images.pexels.com/photos/2449543/pexels-photo-2449543.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: '3',
        type: 'encode',
        filename: 'profile-picture.jpg',
        timestamp: '2025-04-15T16:45:00Z',
        messageLength: 247,
        previewUrl: 'https://images.pexels.com/photos/3680959/pexels-photo-3680959.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: '4',
        type: 'encode',
        filename: 'party-photo.png',
        timestamp: '2025-04-10T20:30:00Z',
        messageLength: 122,
        previewUrl: 'https://images.pexels.com/photos/2505693/pexels-photo-2505693.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: '5',
        type: 'decode',
        filename: 'hidden-data.jpg',
        timestamp: '2025-04-08T11:20:00Z',
        messageLength: 78,
        previewUrl: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ];

    setHistory(demoHistory);
  }, []);

  const filteredHistory = history
    .filter(item => {
      // Filter by type
      if (filter !== 'all' && item.type !== filter) return false;
      
      // Filter by search term
      if (search && !item.filename.toLowerCase().includes(search.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by timestamp
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleRemoveItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Activity History
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your recent steganography operations.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="input bg-white dark:bg-gray-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'encode' | 'decode')}
            >
              <option value="all">All Types</option>
              <option value="encode">Encoded</option>
              <option value="decode">Decoded</option>
            </select>
            
            <button
              className="btn-outline px-3"
              onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
            >
              {sort === 'newest' ? (
                <ArrowDown className="h-5 w-5" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              No history found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search || filter !== 'all' 
                ? "No items match your current filters"
                : "Your steganography activity will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Message Size
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sr-only">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={item.previewUrl}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {item.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'encode'
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
                        }`}
                      >
                        {item.type === 'encode' ? 'Encoded' : 'Decoded'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-1" />
                        {item.messageLength} chars
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                          title="Delete"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;