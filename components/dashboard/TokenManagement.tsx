'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Token {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  is_active: boolean;
}

interface NewToken {
  token: string;
  id: string;
  name: string;
  created_at: string;
  expires_at?: string;
}

export function TokenManagement() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [newToken, setNewToken] = useState<NewToken | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [expiresIn, setExpiresIn] = useState<'7d' | '30d' | '90d' | '1y' | null>('30d');
  const [isCreating, setIsCreating] = useState(false);
  const [showNewToken, setShowNewToken] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch tokens on mount
  useEffect(() => {
    fetchTokens();
  }, []);

  async function fetchTokens() {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens');
      if (!response.ok) throw new Error('Failed to fetch tokens');
      const data = await response.json();
      setTokens(data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateToken(e: React.FormEvent) {
    e.preventDefault();

    if (!tokenName.trim()) {
      alert('Token name is required');
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tokenName.trim(),
          description: tokenDescription.trim() || undefined,
          expiresIn,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to create token');
        return;
      }

      const data = await response.json();
      setNewToken(data);
      setTokenName('');
      setTokenDescription('');
      setShowNewToken(true);
      await fetchTokens();
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteToken(id: string) {
    if (!confirm('Are you sure you want to delete this token? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/tokens/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete token');
      
      setTokens(tokens.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting token:', error);
      alert('Failed to delete token');
    } finally {
      setDeleting(null);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getExpirationStatus(expiresAt?: string) {
    if (!expiresAt) return { text: 'Never expires', color: 'text-green-600 dark:text-green-400' };
    
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { text: 'Expired', color: 'text-red-600 dark:text-red-400' };
    } else if (daysLeft < 7) {
      return { text: `Expires in ${daysLeft} days`, color: 'text-amber-600 dark:text-amber-400' };
    } else {
      return { text: `Expires in ${daysLeft} days`, color: 'text-gray-600 dark:text-gray-400' };
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Tokens</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage API tokens for programmatic access
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Generate New Token
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate New API Token</DialogTitle>
              <DialogDescription>
                Create a new token for API access. You'll only see it once.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateToken} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Token Name *</label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g., My App, GitHub Action"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Description (optional)</label>
                <textarea
                  value={tokenDescription}
                  onChange={(e) => setTokenDescription(e.target.value)}
                  placeholder="What will you use this token for?"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  rows={3}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Expiration</label>
                <select
                  value={expiresIn || ''}
                  onChange={(e) => setExpiresIn(e.target.value as any)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  disabled={isCreating}
                >
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                  <option value="1y">1 year</option>
                  <option value="">Never expires</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isCreating || !tokenName.trim()}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {isCreating ? 'Creating...' : 'Create Token'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* New Token Display */}
      {newToken && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Token Created! 🎉</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Save this token securely. You won't be able to see it again.
              </p>
            </div>
            <button
              onClick={() => setShowNewToken(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-100"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 rounded p-3 mb-3 flex items-center justify-between font-mono text-sm break-all">
            <span className={showNewToken ? 'text-blue-900 dark:text-blue-100' : 'text-blue-900 dark:text-blue-100'}>
              {showNewToken ? newToken.token : '••••••••••••••••••••••••••••••••••••••••'}
            </span>
            <button
              onClick={() => {
                if (showNewToken) {
                  copyToClipboard(newToken.token);
                } else {
                  setShowNewToken(true);
                }
              }}
              className="ml-2 p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
              title={showNewToken ? 'Copy' : 'Reveal'}
            >
              {showNewToken ? (
                copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-xs text-blue-700 dark:text-blue-300">
            Use this token in your applications: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Authorization: Bearer {newToken.token}</code>
          </p>
        </div>
      )}

      {/* Tokens List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tokens...</div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tokens yet. Create one to start using the API.</p>
          </div>
        ) : (
          tokens.map((token) => {
            const expirationStatus = getExpirationStatus(token.expires_at);
            return (
              <div
                key={token.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{token.name}</h3>
                    {token.description && (
                      <p className="text-sm text-muted-foreground mt-1">{token.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteToken(token.id)}
                    disabled={deleting === token.id}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete token"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
                  <div className="flex gap-4">
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(token.created_at)}
                    </div>
                    {token.last_used_at && (
                      <div>
                        <span className="font-medium">Last used:</span> {formatDate(token.last_used_at)}
                      </div>
                    )}
                  </div>
                  <div className={`font-medium ${expirationStatus.color} whitespace-nowrap`}>
                    {expirationStatus.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-muted p-4 rounded-lg border border-border">
        <h3 className="font-semibold mb-2">How to use your token</h3>
        <pre className="bg-background rounded p-3 text-xs overflow-x-auto">
          <code className="text-muted-foreground">
            {`curl -X POST https://your-domain.com/api/v1/shorten \\
  -H "Authorization: Bearer uplink_your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/long"}'`}
          </code>
        </pre>
        <p className="text-xs text-muted-foreground mt-2">
          See full documentation at <a href="/docs" className="text-amber-700 dark:text-amber-400 hover:underline">/docs</a>
        </p>
      </div>
    </div>
  );
}
