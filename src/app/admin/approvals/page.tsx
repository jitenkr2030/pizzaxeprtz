"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Users, UserCheck, UserX, Clock, Mail, Phone, Calendar, MapPin, Building, CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare, FileText, Settings } from "lucide-react"

interface RegistrationRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  requestedRole: 'customer' | 'delivery' | 'staff'
  businessName?: string
  businessType?: string
  businessAddress?: string
  experience?: string
  vehicleInfo?: {
    type: string
    make: string
    model: string
    year: number
    licensePlate: string
  }
  documents: {
    id: string
    type: string
    name: string
    status: 'pending' | 'approved' | 'rejected'
    url: string
  }[]
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  rejectionReason?: string
}

interface ApprovalWorkflow {
  id: string
  name: string
  description: string
  roles: string[]
  requiredDocuments: string[]
  autoApprove: boolean
  conditions: string[]
}

const sampleRequests: RegistrationRequest[] = [
  {
    id: "1",
    firstName: "Lisa",
    lastName: "Chen",
    email: "lisa.chen@email.com",
    phone: "+1 (555) 456-7890",
    requestedRole: "customer",
    status: "pending",
    submittedAt: "2024-01-20T12:00:00",
    documents: [
      {
        id: "1",
        type: "id_verification",
        name: "Driver License",
        status: "pending",
        url: "/documents/dl-lisa-chen.pdf"
      }
    ]
  },
  {
    id: "2",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@email.com",
    phone: "+1 (555) 234-5678",
    requestedRole: "delivery",
    businessName: "Quick Delivery Services",
    businessType: "independent",
    businessAddress: "789 Delivery St, New York, NY 10001",
    experience: "3 years of delivery experience with food services",
    vehicleInfo: {
      type: "car",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      licensePlate: "ABC123"
    },
    status: "pending",
    submittedAt: "2024-01-19T15:30:00",
    documents: [
      {
        id: "2",
        type: "id_verification",
        name: "Driver License",
        status: "pending",
        url: "/documents/dl-robert.pdf"
      },
      {
        id: "3",
        type: "vehicle_registration",
        name: "Vehicle Registration",
        status: "pending",
        url: "/documents/vr-robert.pdf"
      },
      {
        id: "4",
        type: "insurance",
        name: "Insurance Certificate",
        status: "pending",
        url: "/documents/insurance-robert.pdf"
      }
    ]
  },
  {
    id: "3",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 345-6789",
    requestedRole: "staff",
    businessName: "Pizza Palace",
    businessType: "restaurant",
    businessAddress: "321 Pizza Ave, Brooklyn, NY 11201",
    experience: "5 years in restaurant industry, 2 years as kitchen staff",
    status: "pending",
    submittedAt: "2024-01-18T10:15:00",
    documents: [
      {
        id: "5",
        type: "id_verification",
        name: "Passport",
        status: "pending",
        url: "/documents/passport-maria.pdf"
      },
      {
        id: "6",
        type: "food_handler_permit",
        name: "Food Handler Permit",
        status: "pending",
        url: "/documents/fhp-maria.pdf"
      }
    ]
  }
]

const approvalWorkflows: ApprovalWorkflow[] = [
  {
    id: "customer",
    name: "Customer Registration",
    description: "Standard customer account approval",
    roles: ["customer"],
    requiredDocuments: ["id_verification"],
    autoApprove: true,
    conditions: ["Valid email address", "Phone number verification"]
  },
  {
    id: "delivery",
    name: "Delivery Partner",
    description: "Delivery partner approval process",
    roles: ["delivery"],
    requiredDocuments: ["id_verification", "vehicle_registration", "insurance"],
    autoApprove: false,
    conditions: ["Valid driver license", "Insured vehicle", "Clean driving record"]
  },
  {
    id: "staff",
    name: "Restaurant Staff",
    description: "Restaurant staff approval process",
    roles: ["staff", "manager"],
    requiredDocuments: ["id_verification", "food_handler_permit"],
    autoApprove: false,
    conditions: ["Food handler certification", "Background check", "Experience verification"]
  }
]

export default function UserApprovalWorkflow() {
  const [requests, setRequests] = useState<RegistrationRequest[]>(sampleRequests)
  const [workflows] = useState<ApprovalWorkflow[]>(approvalWorkflows)
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [rejectionDialog, setRejectionDialog] = useState<{open: boolean; requestId: string}>({ open: false, requestId: "" })
  const [rejectionReason, setRejectionReason] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || request.requestedRole === selectedRole
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const approveRequest = (requestId: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin User',
            notes: approvalNotes
          }
        : request
    ))
    setSelectedRequest(null)
    setApprovalNotes("")
  }

  const rejectRequest = (requestId: string, reason: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin User',
            rejectionReason: reason
          }
        : request
    ))
    setRejectionDialog({ open: false, requestId: "" })
    setRejectionReason("")
    setSelectedRequest(null)
  }

  const getWorkflowForRole = (role: string) => {
    return workflows.find(workflow => workflow.roles.includes(role))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPendingRequests = () => requests.filter(r => r.status === 'pending')
  const getApprovedRequests = () => requests.filter(r => r.status === 'approved')
  const getRejectedRequests = () => requests.filter(r => r.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">User Approval Workflow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Registration Management</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{getPendingRequests().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{getApprovedRequests().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{getRejectedRequests().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Workflow Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <div className="flex justify-between items-start">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({getPendingRequests().length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({getApprovedRequests().length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({getRejectedRequests().length})</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.filter(r => r.status === 'pending').map(request => {
                const workflow = getWorkflowForRole(request.requestedRole)
                
                return (
                  <Card key={request.id} className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {request.firstName} {request.lastName}
                          </CardTitle>
                          <CardDescription>{request.email} • {request.phone}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            {request.requestedRole.charAt(0).toUpperCase() + request.requestedRole.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Business Information */}
                        {(request.businessName || request.businessAddress) && (
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Building className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="font-medium">{request.businessName}</span>
                            </div>
                            {request.businessAddress && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{request.businessAddress}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Experience */}
                        {request.experience && (
                          <div>
                            <div className="text-sm font-medium mb-1">Experience:</div>
                            <div className="text-sm text-gray-600">{request.experience}</div>
                          </div>
                        )}

                        {/* Vehicle Information */}
                        {request.vehicleInfo && (
                          <div>
                            <div className="text-sm font-medium mb-1">Vehicle Information:</div>
                            <div className="text-sm text-gray-600">
                              {request.vehicleInfo.year} {request.vehicleInfo.make} {request.vehicleInfo.model}
                              <br />
                              License: {request.vehicleInfo.licensePlate}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        <div>
                          <div className="text-sm font-medium mb-2">Required Documents:</div>
                          <div className="space-y-2">
                            {workflow?.requiredDocuments.map(docType => {
                              const doc = request.documents.find(d => d.type === docType)
                              return (
                                <div key={docType} className="flex items-center justify-between text-sm">
                                  <span>{docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  {doc ? (
                                    <Badge className={getDocumentStatusColor(doc.status)}>
                                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-800">Not Provided</Badge>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Submitted Date */}
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(request.submittedAt).toLocaleString()}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setRejectionDialog({ open: true, requestId: request.id })
                              setSelectedRequest(request)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.filter(r => r.status === 'approved').map(request => (
                <Card key={request.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.firstName} {request.lastName}
                        </CardTitle>
                        <CardDescription>{request.email}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Role: {request.requestedRole}</div>
                      <div>Approved: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'N/A'}</div>
                      <div>Reviewed by: {request.reviewedBy || 'N/A'}</div>
                      {request.notes && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <div className="font-medium">Notes:</div>
                          <div>{request.notes}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.filter(r => r.status === 'rejected').map(request => (
                <Card key={request.id} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.firstName} {request.lastName}
                        </CardTitle>
                        <CardDescription>{request.email}</CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Role: {request.requestedRole}</div>
                      <div>Rejected: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'N/A'}</div>
                      <div>Reviewed by: {request.reviewedBy || 'N/A'}</div>
                      {request.rejectionReason && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <div className="font-medium text-red-800">Rejection Reason:</div>
                          <div className="text-red-700">{request.rejectionReason}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflows.map(workflow => (
                <Card key={workflow.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Target Roles:</div>
                        <div className="flex flex-wrap gap-1">
                          {workflow.roles.map(role => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Required Documents:</div>
                        <div className="space-y-1">
                          {workflow.requiredDocuments.map(doc => (
                            <div key={doc} className="flex items-center text-sm">
                              <FileText className="h-3 w-3 mr-2 text-gray-600" />
                              {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Conditions:</div>
                        <div className="space-y-1">
                          {workflow.conditions.map((condition, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                              {condition}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto Approve:</span>
                        <Badge className={workflow.autoApprove ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {workflow.autoApprove ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure Workflow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Request Review Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Registration Request</DialogTitle>
              <DialogDescription>
                Review and approve {selectedRequest.firstName} {selectedRequest.lastName}'s registration
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-medium mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">{selectedRequest.firstName} {selectedRequest.lastName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="font-medium">{selectedRequest.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <div className="font-medium">{selectedRequest.phone}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Requested Role:</span>
                    <div className="font-medium">{selectedRequest.requestedRole}</div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              {(selectedRequest.businessName || selectedRequest.businessAddress) && (
                <div>
                  <h4 className="font-medium mb-3">Business Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRequest.businessName && (
                      <div>
                        <span className="text-gray-600">Business Name:</span>
                        <div className="font-medium">{selectedRequest.businessName}</div>
                      </div>
                    )}
                    {selectedRequest.businessType && (
                      <div>
                        <span className="text-gray-600">Business Type:</span>
                        <div className="font-medium">{selectedRequest.businessType}</div>
                      </div>
                    )}
                    {selectedRequest.businessAddress && (
                      <div>
                        <span className="text-gray-600">Business Address:</span>
                        <div className="font-medium">{selectedRequest.businessAddress}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedRequest.experience && (
                <div>
                  <h4 className="font-medium mb-3">Experience</h4>
                  <div className="text-sm text-gray-600">{selectedRequest.experience}</div>
                </div>
              )}

              {/* Vehicle Information */}
              {selectedRequest.vehicleInfo && (
                <div>
                  <h4 className="font-medium mb-3">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium">{selectedRequest.vehicleInfo.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Make:</span>
                      <div className="font-medium">{selectedRequest.vehicleInfo.make}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <div className="font-medium">{selectedRequest.vehicleInfo.model}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <div className="font-medium">{selectedRequest.vehicleInfo.year}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">License Plate:</span>
                      <div className="font-medium">{selectedRequest.vehicleInfo.licensePlate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h4 className="font-medium mb-3">Documents</h4>
                <div className="space-y-2">
                  {selectedRequest.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-600">{doc.type.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDocumentStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Notes */}
              <div>
                <Label htmlFor="approvalNotes">Approval Notes (Optional)</Label>
                <Textarea
                  id="approvalNotes"
                  placeholder="Add any notes about this approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  onClick={() => approveRequest(selectedRequest.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </Button>
                <Button 
                  onClick={() => {
                    setRejectionDialog({ open: true, requestId: selectedRequest.id })
                  }}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.open} onOpenChange={(open) => setRejectionDialog({ open, requestId: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this registration request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => rejectRequest(rejectionDialog.requestId, rejectionReason)}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRejectionDialog({ open: false, requestId: "" })}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}