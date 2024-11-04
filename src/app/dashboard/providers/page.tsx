'use client'

import { useState } from 'react'
import { Plus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define available providers and their descriptions
const providers = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Access GPT-4, GPT-3.5, and other OpenAI models',
    docsUrl: 'https://platform.openai.com/docs/api-reference',
    keyPattern: 'sk-...',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Access Claude and other Anthropic models',
    docsUrl: 'https://docs.anthropic.com/claude/reference',
    keyPattern: 'sk-ant-...',
  },
  // Add more providers as needed
]

interface ProviderKey {
  id: string
  provider: string
  name: string
  key: string
  createdAt: Date
  isVisible?: boolean
}

export default function ProvidersPage() {
  const [keys, setKeys] = useState<ProviderKey[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const newKey: ProviderKey = {
      id: crypto.randomUUID(),
      provider: formData.get('provider') as string,
      name: formData.get('key-name') as string,
      key: formData.get('api-key') as string,
      createdAt: new Date(),
    }
    
    setKeys([...keys, newKey])
    setIsDialogOpen(false)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setKeys(keys.map(key => 
      key.id === keyId ? { ...key, isVisible: !key.isVisible } : key
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-gray-500">Manage your API keys for different providers</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
              <DialogDescription>
                Enter your API key details below. Make sure to keep your API keys secure.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateKey} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select name="provider" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  name="key-name"
                  placeholder="e.g., Production OpenAI Key"
                  required
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  name="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Save API Key
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            A list of all your API keys across different providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider Name</TableHead>
                <TableHead>Provider ID</TableHead>
                <TableHead>Key Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => {
                const provider = providers.find(p => p.id === key.provider)
                return (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{provider?.name}</TableCell>
                    <TableCell>{key.provider}</TableCell>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {key.isVisible ? (
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {key.key}
                          </code>
                        ) : (
                          <span className="font-mono">••••••••••••••••</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {key.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setKeys(keys.filter((k) => k.id !== key.id))
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
