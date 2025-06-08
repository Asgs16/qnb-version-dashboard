
export interface BuildInfo {
  component: string;
  env: string;
  version: string;
  last_updated: string;
  status: 'success' | 'pending' | 'failed';
  deployment_id?: string;
}

export class BuildService {
  private static S3_BUCKET_URL = 'https://your-s3-bucket.s3.amazonaws.com/builds.json';
  
  static async fetchBuilds(): Promise<BuildInfo[]> {
    try {
      // In production, this would fetch from your S3 bucket
      const response = await fetch(this.S3_BUCKET_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const builds = await response.json();
      return builds;
    } catch (error) {
      console.warn('Failed to fetch from S3, using fallback data:', error);
      
      // Fallback mock data for development/demo
      return this.getMockBuilds();
    }
  }
  
  static getMockBuilds(): BuildInfo[] {
    // This represents the actual QNB components you want to track
    const components = [
      'RAP',
      'Prod (API) QNB',
      'Replica Quote QNB',
      'AGGR',
      'DIRECT QNB',
      'PLUS QNB',
      'REPLICA QNB',
      'MI QNB',
      'Health GMC QNB',
      'BOT QNB',
      'BOT-REPLICA QNB',
      'DC QNB',
      'DC-REPLICA QNB',
      'Plus Health QNB',
      'CCM QNB',
      'Institutional QNB',
      'Payment QNB',
      'Premium Plus QNB',
      'Premium Plus-REPLICA QNB',
      'Motor Plus QNB'
    ];
    
    const statuses: Array<'success' | 'pending' | 'failed'> = ['success', 'pending', 'failed'];
    const builds: BuildInfo[] = [];
    
    components.forEach((component, index) => {
      ['prod', 'pre-prod'].forEach(env => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const baseVersion = `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
        
        builds.push({
          component,
          env,
          version: baseVersion,
          last_updated: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          status: randomStatus,
          deployment_id: `deploy-${Date.now()}-${index}`
        });
      });
    });
    
    return builds;
  }
  
  static async uploadBuilds(builds: BuildInfo[]): Promise<void> {
    // This would be called by your deployment pipeline
    console.log('Uploading builds to S3:', builds);
    
    // Example AWS SDK v3 usage:
    // const s3Client = new S3Client({ region: 'your-region' });
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: 'your-bucket-name',
    //   Key: 'builds.json',
    //   Body: JSON.stringify(builds),
    //   ContentType: 'application/json'
    // }));
  }
}
