"use client";

import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const [clientSession, setClientSession] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Get session from getSession function
    getSession().then((session) => {
      setClientSession(session);
    });

    // Check cookies
    const cookies = document.cookie;
    setDebugInfo({
      cookies: cookies,
      href: window.location.href,
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Debug</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>useSession Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Session:</strong></p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>getSession() Function</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Client Session:</strong></p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(clientSession, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Current URL:</strong> {debugInfo.href}</p>
              <p><strong>Cookies:</strong></p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                {debugInfo.cookies}
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button 
            variant="outline"
            onClick={async () => {
              const fresh = await getSession();
              setClientSession(fresh);
            }}
          >
            Refresh Session
          </Button>
        </div>
      </div>
    </div>
  );
}