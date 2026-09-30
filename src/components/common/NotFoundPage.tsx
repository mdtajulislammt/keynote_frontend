import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
        <HelpCircle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
        The endpoint or route you requested does not exist on this client application.
      </p>
      <div className="flex gap-3">
        <Link to="/posts">
          <Button size="sm">Explore Public Feed</Button>
        </Link>
        <Link to="/notes">
          <Button variant="outline" size="sm">
            My Notes
          </Button>
        </Link>
      </div>
    </div>
  );
};
