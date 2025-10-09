'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Headphones, 
  Users, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  Bot,
  Phone,
  Mail,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react'

interface SupportTicket {
  id: string
  ticketNumber: string
  userId: string
  subject: string
  description: string
  category: 'order' | 'payment' | 'delivery' | 'technical' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
  assignedAgent?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  satisfaction?: number
}

interface SupportAgent {
  id: string
  name: string
  email: string
  specialization: string[]
  maxTickets: number
  currentLoad: number
  availability: 'online' | 'offline' | 'busy'
  avgResolutionTime: number
  satisfaction: number
  isActive: boolean
}

interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  helpful: number
  createdAt: string
  isActive: boolean
}

interface SupportAnalytics {
  overview: {
    totalTickets: number
    openTickets: number
    avgResolutionTime: number
    customerSatisfaction: number
    firstResponseTime: number
    escalationRate: number
  }
  ticketTrends: {
    daily: Array<{
      date: string
      created: number
      resolved: number
    }>
  }
  categoryBreakdown: Array<{
    category: string
    count: number
    percentage: number
  }>
  agentPerformance: Array<{
    agent: string
    tickets: number
    avgTime: number
    satisfaction: number
  }>
}

export function SupportAutomation({ storeId, isAdmin = false }: { storeId: string; isAdmin?: boolean }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [agents, setAgents] = useState<SupportAgent[]>([])
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([])
  const [analytics, setAnalytics] = useState<SupportAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)

  useEffect(() => {
    loadSupportData()
  }, [storeId])

  const loadSupportData = async () => {
    setLoading(true)
    try {
      const [ticketsRes, agentsRes, articlesRes, analyticsRes] = await Promise.all([
        fetch(`/api/automation/support?storeId=${storeId}&action=tickets`),
        fetch(`/api/automation/support?storeId=${storeId}&action=agents`),
        fetch(`/api/automation/support?storeId=${storeId}&action=knowledge-base`),
        fetch(`/api/automation/support?storeId=${storeId}&action=analytics`)
      ])

      const [ticketsData, agentsData, articlesData, analyticsData] = await Promise.all([
        ticketsRes.json(),
        agentsRes.json(),
        articlesRes.json(),
        analyticsRes.json()
      ])

      setTickets(ticketsData.tickets || [])
      setAgents(agentsData.agents || [])
      setArticles(articlesData.articles || [])
      setAnalytics(analyticsData.analytics)
    } catch (error) {
      console.error('Error loading support data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoAssign = async () => {
    try {
      const response = await fetch(`/api/automation/support?storeId=${storeId}&action=auto-assign-tickets`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.assignments) {
        alert(`Auto-assigned ${data.assignments.length} tickets`)
        loadSupportData()
      }
    } catch (error) {
      console.error('Error auto-assigning tickets:', error)
    }
  }

  const handleAssignTicket = async (ticketId: string, agentId: string) => {
    try {
      const response = await fetch(`/api/automation/support?storeId=${storeId}&action=assign-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, agentId })
      })
      const data = await response.json()
      if (data.message) {
        loadSupportData()
      }
    } catch (error) {
      console.error('Error assigning ticket:', error)
    }
  }

  const handleEscalateTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/automation/support?storeId=${storeId}&action=escalate-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      })
      const data = await response.json()
      if (data.message) {
        loadSupportData()
      }
    } catch (error) {
      console.error('Error escalating ticket:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'escalated': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'busy': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'offline': return <AlertCircle className="h-4 w-4 text-gray-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.openTickets}</div>
              <p className="text-xs text-muted-foreground">
                Total: {analytics.overview.totalTickets}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.firstResponseTime}m</div>
              <p className="text-xs text-muted-foreground">
                Target: 10m
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.customerSatisfaction}/5</div>
              <p className="text-xs text-muted-foreground">
                Customer rating
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.avgResolutionTime}m</div>
              <p className="text-xs text-muted-foreground">
                Average time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            {analytics && (
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Categories</CardTitle>
                  <CardDescription>Breakdown by support category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium capitalize">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{category.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common support automation tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={() => setShowCreateTicket(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAutoAssign}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Assign Tickets
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={loadSupportData}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>Latest support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{ticket.subject}</span>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.description.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.assignedAgent && (
                        <Badge variant="outline">
                          {agents.find(a => a.id === ticket.assignedAgent)?.name || 'Assigned'}
                        </Badge>
                      )}
                      {ticket.satisfaction && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{ticket.satisfaction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Support Tickets</h3>
            <div className="flex gap-2">
              <Button onClick={handleAutoAssign}>
                <Zap className="h-4 w-4 mr-2" />
                Auto-Assign
              </Button>
              <Button onClick={() => setShowCreateTicket(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                        <CardDescription>
                          {ticket.ticketNumber} • {ticket.category}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Assigned Agent</h4>
                      <p className="text-sm text-muted-foreground">
                        {ticket.assignedAgent 
                          ? agents.find(a => a.id === ticket.assignedAgent)?.name || 'Unknown'
                          : 'Unassigned'
                        }
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Created</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!ticket.assignedAgent && (
                      <Select onValueChange={(agentId) => handleAssignTicket(ticket.id, agentId)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Assign to agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.filter(agent => agent.availability === 'online').map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {ticket.status !== 'escalated' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEscalateTicket(ticket.id)}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <h3 className="text-lg font-semibold">Support Agents</h3>

          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAvailabilityIcon(agent.availability)}
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Specialization</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Load</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.currentLoad} / {agent.maxTickets} tickets
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(agent.currentLoad / agent.maxTickets) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Avg Resolution</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.avgResolutionTime} minutes
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Satisfaction</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{agent.satisfaction}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <h3 className="text-lg font-semibold">Knowledge Base</h3>

          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>
                        {article.category} • {article.views} views
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{article.helpful}</span>
                      </div>
                      <Badge variant={article.isActive ? "default" : "secondary"}>
                        {article.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{article.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}