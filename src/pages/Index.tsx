
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BuildInfo {
  component: string;
  env: string;
  version: string;
  build_number: string;
  last_updated: string;
  status: 'success' | 'pending' | 'failed';
  deployment_id?: string;
}

const Index = () => {
  const [builds, setBuilds] = useState<BuildInfo[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock data that represents the actual QNB components
  const mockBuilds: BuildInfo[] = [
    { component: "RAP", env: "prod", version: "v2.4.8", build_number: "#2048", last_updated: "2025-06-08T10:30:00Z", status: "success" },
    { component: "RAP", env: "pre-prod", version: "v2.4.9", build_number: "#2049", last_updated: "2025-06-08T09:15:00Z", status: "success" },
    { component: "Prod (API) QNB", env: "prod", version: "v1.7.2", build_number: "#1072", last_updated: "2025-06-08T08:45:00Z", status: "success" },
    { component: "Prod (API) QNB", env: "pre-prod", version: "v1.7.3", build_number: "#1073", last_updated: "2025-06-08T11:20:00Z", status: "pending" },
    { component: "Replica Quote QNB", env: "prod", version: "v3.1.5", build_number: "#3015", last_updated: "2025-06-08T07:30:00Z", status: "success" },
    { component: "Replica Quote QNB", env: "pre-prod", version: "v3.1.6", build_number: "#3016", last_updated: "2025-06-08T10:00:00Z", status: "success" },
    { component: "AGGR", env: "prod", version: "v4.2.1", build_number: "#4021", last_updated: "2025-06-08T06:15:00Z", status: "success" },
    { component: "AGGR", env: "pre-prod", version: "v4.2.2", build_number: "#4022", last_updated: "2025-06-08T09:45:00Z", status: "failed" },
    { component: "DIRECT QNB", env: "prod", version: "v5.0.4", build_number: "#5004", last_updated: "2025-06-08T08:00:00Z", status: "success" },
    { component: "DIRECT QNB", env: "pre-prod", version: "v5.0.5", build_number: "#5005", last_updated: "2025-06-08T10:30:00Z", status: "success" },
    { component: "PLUS QNB", env: "prod", version: "v2.8.3", build_number: "#2083", last_updated: "2025-06-08T07:45:00Z", status: "success" },
    { component: "PLUS QNB", env: "pre-prod", version: "v2.8.4", build_number: "#2084", last_updated: "2025-06-08T11:00:00Z", status: "pending" },
    { component: "REPLICA QNB", env: "prod", version: "v1.9.7", build_number: "#1097", last_updated: "2025-06-08T06:30:00Z", status: "success" },
    { component: "REPLICA QNB", env: "pre-prod", version: "v1.9.8", build_number: "#1098", last_updated: "2025-06-08T09:15:00Z", status: "success" },
    { component: "MI QNB", env: "prod", version: "v3.5.2", build_number: "#3052", last_updated: "2025-06-08T08:20:00Z", status: "success" },
    { component: "MI QNB", env: "pre-prod", version: "v3.5.3", build_number: "#3053", last_updated: "2025-06-08T10:45:00Z", status: "success" },
    { component: "Health GMC QNB", env: "prod", version: "v2.3.1", build_number: "#2031", last_updated: "2025-06-08T07:00:00Z", status: "success" },
    { component: "Health GMC QNB", env: "pre-prod", version: "v2.3.2", build_number: "#2032", last_updated: "2025-06-08T09:30:00Z", status: "success" },
    { component: "BOT QNB", env: "prod", version: "v1.6.4", build_number: "#1064", last_updated: "2025-06-08T06:45:00Z", status: "success" },
    { component: "BOT QNB", env: "pre-prod", version: "v1.6.5", build_number: "#1065", last_updated: "2025-06-08T10:15:00Z", status: "success" },
    { component: "BOT-REPLICA QNB", env: "prod", version: "v1.6.4", build_number: "#1064", last_updated: "2025-06-08T06:45:00Z", status: "success" },
    { component: "BOT-REPLICA QNB", env: "pre-prod", version: "v1.6.5", build_number: "#1065", last_updated: "2025-06-08T10:15:00Z", status: "success" },
    { component: "DC QNB", env: "prod", version: "v4.1.8", build_number: "#4018", last_updated: "2025-06-08T08:30:00Z", status: "success" },
    { component: "DC QNB", env: "pre-prod", version: "v4.1.9", build_number: "#4019", last_updated: "2025-06-08T11:15:00Z", status: "pending" },
    { component: "DC-REPLICA QNB", env: "prod", version: "v4.1.8", build_number: "#4018", last_updated: "2025-06-08T08:30:00Z", status: "success" },
    { component: "DC-REPLICA QNB", env: "pre-prod", version: "v4.1.9", build_number: "#4019", last_updated: "2025-06-08T11:15:00Z", status: "pending" },
    { component: "Plus Health QNB", env: "prod", version: "v3.2.6", build_number: "#3026", last_updated: "2025-06-08T07:15:00Z", status: "success" },
    { component: "Plus Health QNB", env: "pre-prod", version: "v3.2.7", build_number: "#3027", last_updated: "2025-06-08T09:45:00Z", status: "success" },
    { component: "CCM QNB", env: "prod", version: "v2.1.3", build_number: "#2013", last_updated: "2025-06-08T06:00:00Z", status: "success" },
    { component: "CCM QNB", env: "pre-prod", version: "v2.1.4", build_number: "#2014", last_updated: "2025-06-08T10:00:00Z", status: "success" },
    { component: "Institutional QNB", env: "prod", version: "v1.4.2", build_number: "#1042", last_updated: "2025-06-08T08:15:00Z", status: "success" },
    { component: "Institutional QNB", env: "pre-prod", version: "v1.4.3", build_number: "#1043", last_updated: "2025-06-08T10:30:00Z", status: "success" },
    { component: "Payment QNB", env: "prod", version: "v5.3.1", build_number: "#5031", last_updated: "2025-06-08T07:30:00Z", status: "success" },
    { component: "Payment QNB", env: "pre-prod", version: "v5.3.2", build_number: "#5032", last_updated: "2025-06-08T11:00:00Z", status: "success" },
    { component: "Premium Plus QNB", env: "prod", version: "v2.7.4", build_number: "#2074", last_updated: "2025-06-08T06:45:00Z", status: "success" },
    { component: "Premium Plus QNB", env: "pre-prod", version: "v2.7.5", build_number: "#2075", last_updated: "2025-06-08T09:30:00Z", status: "success" },
    { component: "Premium Plus-REPLICA QNB", env: "prod", version: "v2.7.4", build_number: "#2074", last_updated: "2025-06-08T06:45:00Z", status: "success" },
    { component: "Premium Plus-REPLICA QNB", env: "pre-prod", version: "v2.7.5", build_number: "#2075", last_updated: "2025-06-08T09:30:00Z", status: "success" },
    { component: "Motor Plus QNB", env: "prod", version: "v3.8.2", build_number: "#3082", last_updated: "2025-06-08T08:00:00Z", status: "success" },
    { component: "Motor Plus QNB", env: "pre-prod", version: "v3.8.3", build_number: "#3083", last_updated: "2025-06-08T10:45:00Z", status: "success" },
  ];

  useEffect(() => {
    // Simulate fetching data from S3/API
    setBuilds(mockBuilds);
  }, []);

  const refreshBuilds = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would fetch from S3 or your API
    setBuilds(mockBuilds);
    setLastRefresh(new Date());
    setIsRefreshing(false);
    
    toast({
      title: "Builds Updated",
      description: "Latest build versions have been fetched successfully.",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const filterBuildsByEnv = (env: string) => {
    return builds.filter(build => build.env === env);
  };

  const BuildCard = ({ build }: { build: BuildInfo }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{build.component}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(build.status)}
            <Badge className={getStatusColor(build.status)}>
              {build.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version:</span>
            <Badge variant="outline" className="font-mono">
              {build.version}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Build Number:</span>
            <Badge variant="outline" className="font-mono text-blue-600">
              {build.build_number}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Environment:</span>
            <Badge variant={build.env === 'prod' ? 'default' : 'secondary'}>
              {build.env === 'prod' ? 'Production' : 'Pre-Production'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Updated:</span>
            <span className="text-sm font-mono">{formatTime(build.last_updated)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">QNB Build Dashboard</h1>
              <p className="text-lg text-gray-600 mt-2">Digit Insurance - Live Build Versions</p>
            </div>
            <Button 
              onClick={refreshBuilds} 
              disabled={isRefreshing}
              size="lg"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Last updated: {lastRefresh.toLocaleString()}</span>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Auto-refresh every 5 minutes
            </Badge>
          </div>
        </div>

        {/* Environment Tabs */}
        <Tabs defaultValue="prod" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="prod" className="text-lg py-3">
              Production ({filterBuildsByEnv('prod').length} components)
            </TabsTrigger>
            <TabsTrigger value="pre-prod" className="text-lg py-3">
              Pre-Production ({filterBuildsByEnv('pre-prod').length} components)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prod">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterBuildsByEnv('prod').map((build, index) => (
                <BuildCard key={`${build.component}-${build.env}-${index}`} build={build} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pre-prod">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterBuildsByEnv('pre-prod').map((build, index) => (
                <BuildCard key={`${build.component}-${build.env}-${index}`} build={build} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Connected to AWS S3 bucket for real-time build updates
          </p>
          <p className="text-xs mt-1">
            Deployment data automatically updated via Bitbucket Pipelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
