
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface BuildInfo {
  component: string;
  env: string;
  version: string;
  last_updated: string;
  status: 'success' | 'pending' | 'failed';
}

interface BuildStatusSummaryProps {
  builds: BuildInfo[];
}

const BuildStatusSummary = ({ builds }: BuildStatusSummaryProps) => {
  const getStatusCounts = () => {
    const counts = {
      success: builds.filter(b => b.status === 'success').length,
      pending: builds.filter(b => b.status === 'pending').length,
      failed: builds.filter(b => b.status === 'failed').length,
    };
    return counts;
  };

  const counts = getStatusCounts();
  const totalBuilds = builds.length;
  const successRate = totalBuilds > 0 ? Math.round((counts.success / totalBuilds) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Components</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBuilds}</div>
          <p className="text-xs text-muted-foreground">Across all environments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{counts.success}</div>
          <p className="text-xs text-muted-foreground">Deployments completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Badge className={successRate >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {successRate}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            {counts.failed > 0 && (
              <span className="text-red-500">{counts.failed} failed</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildStatusSummary;
