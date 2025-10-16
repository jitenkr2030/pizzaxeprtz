import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// Support automation types
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
  attachments?: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolution?: string
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
  updatedAt: string
  isActive: boolean
}

interface ChatbotSession {
  id: string
  userId: string
  messages: Array<{
    id: string
    type: 'user' | 'bot'
    content: string
    timestamp: string
    attachments?: string[]
  }>
  status: 'active' | 'resolved' | 'escalated'
  escalatedToTicket?: string
  satisfaction?: number
  createdAt: string
  updatedAt: string
}

interface SupportAutomationConfig {
  ticketAssignment: {
    autoAssign: boolean
    loadBalancing: boolean
    skillBasedRouting: boolean
  }
  chatbot: {
    enabled: boolean
    autoEscalate: boolean
    sentimentAnalysis: boolean
    languageDetection: boolean
  }
  knowledgeBase: {
    autoSuggest: boolean
    autoUpdate: boolean
    analytics: boolean
  }
  notifications: {
    customerUpdates: boolean
    agentAlerts: boolean
    escalationAlerts: boolean
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const action = searchParams.get('action')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'tickets':
        return await getSupportTickets(storeId)
      case 'agents':
        return await getSupportAgents(storeId)
      case 'knowledge-base':
        return await getKnowledgeBase(storeId)
      case 'chatbot-sessions':
        return await getChatbotSessions(storeId)
      case 'analytics':
        return await getSupportAnalytics(storeId)
      case 'config':
        return await getSupportConfig(storeId)
      case 'performance':
        return await getSupportPerformance(storeId)
      default:
        return await getSupportOverview(storeId)
    }
  } catch (error) {
    console.error('Support automation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const action = searchParams.get('action')
    const body = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'create-ticket':
        return await createSupportTicket(storeId, body)
      case 'assign-ticket':
        return await assignTicket(storeId, body.ticketId, body.agentId)
      case 'escalate-ticket':
        return await escalateTicket(storeId, body.ticketId)
      case 'resolve-ticket':
        return await resolveTicket(storeId, body.ticketId, body.resolution)
      case 'create-kb-article':
        return await createKnowledgeBaseArticle(storeId, body)
      case 'update-config':
        return await updateSupportConfig(storeId, body)
      case 'chatbot-message':
        return await handleChatbotMessage(storeId, body)
      case 'auto-assign-tickets':
        return await autoAssignTickets(storeId)
      case 'generate-response':
        return await generateAIResponse(storeId, body)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Support automation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getSupportTickets(storeId: string) {
  // Simulate fetching support tickets
  const tickets: SupportTicket[] = [
    {
      id: 'ticket-1',
      ticketNumber: 'SUP-2024-001',
      userId: 'user-1',
      subject: 'Order not delivered',
      description: 'My order #12345 was supposed to be delivered 2 hours ago but still not arrived',
      category: 'delivery',
      priority: 'high',
      status: 'in_progress',
      assignedAgent: 'agent-1',
      tags: ['late-delivery', 'urgent'],
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T16:45:00Z'
    },
    {
      id: 'ticket-2',
      ticketNumber: 'SUP-2024-002',
      userId: 'user-2',
      subject: 'Payment failed',
      description: 'Payment failed when trying to place order. Money deducted but order not confirmed',
      category: 'payment',
      priority: 'urgent',
      status: 'open',
      assignedAgent: 'agent-2',
      tags: ['payment-issue', 'refund'],
      createdAt: '2024-01-15T15:20:00Z',
      updatedAt: '2024-01-15T15:20:00Z'
    },
    {
      id: 'ticket-3',
      ticketNumber: 'SUP-2024-003',
      userId: 'user-3',
      subject: 'Wrong items delivered',
      description: 'Received wrong pizza toppings. Ordered pepperoni but got mushroom',
      category: 'order',
      priority: 'medium',
      status: 'resolved',
      assignedAgent: 'agent-3',
      tags: ['wrong-order', 'quality'],
      resolution: 'Apologized to customer and sent correct order with complimentary dessert',
      satisfaction: 5,
      createdAt: '2024-01-14T18:00:00Z',
      updatedAt: '2024-01-14T20:30:00Z',
      resolvedAt: '2024-01-14T20:30:00Z'
    }
  ]

  return NextResponse.json({ tickets })
}

async function getSupportAgents(storeId: string) {
  // Simulate fetching support agents
  const agents: SupportAgent[] = [
    {
      id: 'agent-1',
      name: 'Sarah Johnson',
      email: 'sarah@support.com',
      specialization: ['delivery', 'order'],
      maxTickets: 15,
      currentLoad: 8,
      availability: 'online',
      avgResolutionTime: 45,
      satisfaction: 4.7,
      isActive: true
    },
    {
      id: 'agent-2',
      name: 'Mike Chen',
      email: 'mike@support.com',
      specialization: ['payment', 'technical'],
      maxTickets: 12,
      currentLoad: 6,
      availability: 'online',
      avgResolutionTime: 30,
      satisfaction: 4.8,
      isActive: true
    },
    {
      id: 'agent-3',
      name: 'Emily Davis',
      email: 'emily@support.com',
      specialization: ['general', 'quality'],
      maxTickets: 10,
      currentLoad: 4,
      availability: 'busy',
      avgResolutionTime: 60,
      satisfaction: 4.6,
      isActive: true
    }
  ]

  return NextResponse.json({ agents })
}

async function getKnowledgeBase(storeId: string) {
  // Simulate fetching knowledge base articles
  const articles: KnowledgeBaseArticle[] = [
    {
      id: 'kb-1',
      title: 'How to track your order',
      content: 'You can track your order by going to the Orders section in the app and clicking on the specific order. You will see real-time updates about your order status and delivery progress.',
      category: 'delivery',
      tags: ['tracking', 'order-status', 'delivery'],
      views: 1250,
      helpful: 1180,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T15:30:00Z',
      isActive: true
    },
    {
      id: 'kb-2',
      title: 'Payment methods accepted',
      content: 'We accept all major credit cards, debit cards, digital wallets like PayPal and Apple Pay, and cash on delivery for select areas.',
      category: 'payment',
      tags: ['payment', 'methods', 'wallet'],
      views: 980,
      helpful: 890,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-05T12:00:00Z',
      isActive: true
    },
    {
      id: 'kb-3',
      title: 'How to modify or cancel your order',
      content: 'You can modify or cancel your order within 5 minutes of placing it. Go to Orders, select the order, and use the Modify/Cancel button. After 5 minutes, please contact support.',
      category: 'order',
      tags: ['modify', 'cancel', 'order-management'],
      views: 756,
      helpful: 680,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-08T14:20:00Z',
      isActive: true
    }
  ]

  return NextResponse.json({ articles })
}

async function getChatbotSessions(storeId: string) {
  // Simulate fetching chatbot sessions
  const sessions: ChatbotSession[] = [
    {
      id: 'chat-1',
      userId: 'user-4',
      messages: [
        {
          id: 'msg-1',
          type: 'user',
          content: 'Where is my order?',
          timestamp: '2024-01-15T16:00:00Z'
        },
        {
          id: 'msg-2',
          type: 'bot',
          content: 'I can help you track your order. Could you please provide your order number?',
          timestamp: '2024-01-15T16:00:05Z'
        },
        {
          id: 'msg-3',
          type: 'user',
          content: 'Order #12345',
          timestamp: '2024-01-15T16:00:15Z'
        },
        {
          id: 'msg-4',
          type: 'bot',
          content: 'Your order #12345 is currently out for delivery and should arrive within 15 minutes. You can track it in real-time in the app.',
          timestamp: '2024-01-15T16:00:20Z'
        }
      ],
      status: 'resolved',
      satisfaction: 5,
      createdAt: '2024-01-15T16:00:00Z',
      updatedAt: '2024-01-15T16:00:20Z'
    }
  ]

  return NextResponse.json({ sessions })
}

async function getSupportAnalytics(storeId: string) {
  // Simulate support analytics
  const analytics = {
    overview: {
      totalTickets: 156,
      openTickets: 23,
      avgResolutionTime: 42,
      customerSatisfaction: 4.6,
      firstResponseTime: 8,
      escalationRate: 12
    },
    ticketTrends: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created: Math.floor(Math.random() * 10) + 2,
        resolved: Math.floor(Math.random() * 8) + 1
      }))
    },
    categoryBreakdown: [
      { category: 'delivery', count: 45, percentage: 28.8 },
      { category: 'order', count: 38, percentage: 24.4 },
      { category: 'payment', count: 32, percentage: 20.5 },
      { category: 'technical', count: 25, percentage: 16.0 },
      { category: 'general', count: 16, percentage: 10.3 }
    ],
    agentPerformance: [
      { agent: 'Sarah Johnson', tickets: 45, avgTime: 45, satisfaction: 4.7 },
      { agent: 'Mike Chen', tickets: 38, avgTime: 30, satisfaction: 4.8 },
      { agent: 'Emily Davis', tickets: 32, avgTime: 60, satisfaction: 4.6 }
    ]
  }

  return NextResponse.json({ analytics })
}

async function getSupportConfig(storeId: string) {
  // Simulate fetching support configuration
  const config: SupportAutomationConfig = {
    ticketAssignment: {
      autoAssign: true,
      loadBalancing: true,
      skillBasedRouting: true
    },
    chatbot: {
      enabled: true,
      autoEscalate: true,
      sentimentAnalysis: true,
      languageDetection: true
    },
    knowledgeBase: {
      autoSuggest: true,
      autoUpdate: true,
      analytics: true
    },
    notifications: {
      customerUpdates: true,
      agentAlerts: true,
      escalationAlerts: true
    }
  }

  return NextResponse.json({ config })
}

async function getSupportPerformance(storeId: string) {
  // Simulate support performance metrics
  const performance = {
    keyMetrics: [
      { metric: 'First Response Time', value: '8 minutes', target: '10 minutes', status: 'good' },
      { metric: 'Resolution Time', value: '42 minutes', target: '60 minutes', status: 'good' },
      { metric: 'Customer Satisfaction', value: '4.6/5', target: '4.0/5', status: 'excellent' },
      { metric: 'Escalation Rate', value: '12%', target: '15%', status: 'good' }
    ],
    recommendations: [
      {
        type: 'training',
        message: 'Provide additional training for agents on payment-related issues',
        impact: 'medium'
      },
      {
        type: 'automation',
        message: 'Implement automated responses for common delivery tracking queries',
        impact: 'high'
      },
      {
        type: 'knowledge-base',
        message: 'Expand knowledge base articles for technical troubleshooting',
        impact: 'medium'
      }
    ]
  }

  return NextResponse.json({ performance })
}

async function getSupportOverview(storeId: string) {
  // Simulate support overview
  const overview = {
    summary: {
      openTickets: 23,
      agentsOnline: 3,
      avgResponseTime: 8,
      satisfaction: 4.6,
      automationScore: 88
    },
    quickStats: [
      { label: 'Tickets Today', value: '12', change: '+2' },
      { label: 'Resolved Today', value: '9', change: '+1' },
      { label: 'Chatbot Sessions', value: '45', change: '+8' },
      { label: 'KB Articles Used', value: '67', change: '+12' }
    ],
    recentActivity: [
      {
        id: 'act-1',
        type: 'ticket_created',
        message: 'New ticket created: Order not delivered (SUP-2024-001)',
        timestamp: '2 hours ago'
      },
      {
        id: 'act-2',
        type: 'ticket_resolved',
        message: 'Ticket resolved: Wrong items delivered (SUP-2024-003)',
        timestamp: '3 hours ago'
      },
      {
        id: 'act-3',
        type: 'chatbot_session',
        message: 'Chatbot resolved order tracking query',
        timestamp: '4 hours ago'
      }
    ]
  }

  return NextResponse.json({ overview })
}

async function createSupportTicket(storeId: string, data: any) {
  // Simulate creating a support ticket
  const ticket: SupportTicket = {
    id: `ticket-${Date.now()}`,
    ticketNumber: `SUP-2024-${Math.floor(Math.random() * 1000)}`,
    ...data,
    status: 'open',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return NextResponse.json({ ticket, message: 'Support ticket created successfully' })
}

async function assignTicket(storeId: string, ticketId: string, agentId: string) {
  // Simulate assigning a ticket to an agent
  return NextResponse.json({ message: `Ticket ${ticketId} assigned to agent ${agentId}` })
}

async function escalateTicket(storeId: string, ticketId: string) {
  // Simulate escalating a ticket
  return NextResponse.json({ message: `Ticket ${ticketId} escalated to senior support` })
}

async function resolveTicket(storeId: string, ticketId: string, resolution: string) {
  // Simulate resolving a ticket
  return NextResponse.json({ 
    message: `Ticket ${ticketId} resolved`,
    resolution,
    resolvedAt: new Date().toISOString()
  })
}

async function createKnowledgeBaseArticle(storeId: string, data: any) {
  // Simulate creating a knowledge base article
  const article: KnowledgeBaseArticle = {
    id: `kb-${Date.now()}`,
    ...data,
    views: 0,
    helpful: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }

  return NextResponse.json({ article, message: 'Knowledge base article created successfully' })
}

async function updateSupportConfig(storeId: string, config: SupportAutomationConfig) {
  // Simulate updating support configuration
  return NextResponse.json({ config, message: 'Support configuration updated successfully' })
}

async function handleChatbotMessage(storeId: string, data: any) {
  // Simulate handling chatbot message with AI
  try {
    const zai = await ZAI.create()
    
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful customer support assistant for a food delivery service. Provide concise, helpful responses about orders, delivery, payments, and general inquiries.'
        },
        {
          role: 'user',
          content: data.message
        }
      ]
    })

    const botResponse = {
      id: `msg-${Date.now()}`,
      type: 'bot',
      content: response.choices[0]?.message?.content || 'I understand your concern. Let me help you with that.',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error('AI chatbot error:', error)
    return NextResponse.json({ 
      response: {
        id: `msg-${Date.now()}`,
        type: 'bot',
        content: 'I understand your concern. Let me connect you with a support agent who can help you better.',
        timestamp: new Date().toISOString()
      }
    })
  }
}

async function autoAssignTickets(storeId: string) {
  // Simulate auto-assigning tickets based on agent availability and specialization
  const assignments = [
    { ticketId: 'ticket-1', agentId: 'agent-1', reason: 'Delivery specialist available' },
    { ticketId: 'ticket-2', agentId: 'agent-2', reason: 'Payment specialist available' }
  ]

  return NextResponse.json({ 
    assignments,
    message: 'Tickets auto-assigned successfully'
  })
}

async function generateAIResponse(storeId: string, data: any) {
  // Simulate generating AI response for support agents
  try {
    const zai = await ZAI.create()
    
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert customer support agent. Generate a professional, empathetic response to the customer inquiry.'
        },
        {
          role: 'user',
          content: `Customer inquiry: ${data.inquiry}\nCustomer sentiment: ${data.sentiment}\nCategory: ${data.category}`
        }
      ]
    })

    const suggestedResponse = response.choices[0]?.message?.content || 'Thank you for reaching out. I understand your concern and will help resolve this issue for you.'

    return NextResponse.json({ 
      suggestedResponse,
      confidence: 0.85
    })
  } catch (error) {
    console.error('AI response generation error:', error)
    return NextResponse.json({ 
      suggestedResponse: 'Thank you for reaching out. I understand your concern and will help resolve this issue for you.',
      confidence: 0.6
    })
  }
}