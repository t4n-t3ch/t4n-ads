"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, FileText, BarChart } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'generated' | 'published';
}

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    generated: 0,
    published: 0,
  });

  useEffect(() => {
    // Simulate fetching documents
    const fetchDocuments = async () => {
      setIsLoading(true);
      // Mock data
      const mockDocuments: Document[] = [
        { id: '1', title: 'Quarterly Report Q1', createdAt: '2023-10-15', status: 'published' },
        { id: '2', title: 'Project Proposal', createdAt: '2023-10-10', status: 'generated' },
        { id: '3', title: 'Meeting Minutes', createdAt: '2023-10-05', status: 'draft' },
        { id: '4', title: 'Client Contract', createdAt: '2023-09-28', status: 'published' },
      ];
      setTimeout(() => {
        setDocuments(mockDocuments);
        setStats({
          total: mockDocuments.length,
          draft: mockDocuments.filter(d => d.status === 'draft').length,
          generated: mockDocuments.filter(d => d.status === 'generated').length,
          published: mockDocuments.filter(d => d.status === 'published').length,
        });
        setIsLoading(false);
      }, 1000);
    };
    fetchDocuments();
  }, []);

  const handleCreateNew = () => {
    router.push('/generate');
  };

  const handleViewDocument = (id: string) => {
    router.push(`/documents/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleCreateNew} className="gap-2">
          <PlusCircle size={20} />
          Create New Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.generated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No documents yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(doc.createdAt).toLocaleDateString()} • Status:{' '}
                      <span
                        className={`font-medium ${
                          doc.status === 'published'
                            ? 'text-green-600'
                            : doc.status === 'generated'
                            ? 'text-blue-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(doc.id)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}