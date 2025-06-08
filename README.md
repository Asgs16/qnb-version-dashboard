
# QNB Build Version Dashboard - Digit Insurance

A real-time dashboard for tracking QNB (Quote Number Builder) component builds across production and pre-production environments.

## 🚀 Features

- **Real-time Build Tracking**: Monitor all QNB components across environments
- **Environment Separation**: Clear distinction between Production and Pre-Production builds
- **Auto-refresh**: Automatic updates every 5 minutes
- **Status Indicators**: Visual status for successful, pending, and failed deployments
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **AWS Integration**: Seamlessly integrates with AWS S3 for data storage

## 🏗️ QNB Components Tracked

- RAP
- Prod (API) QNB
- Replica Quote QNB  
- AGGR
- DIRECT QNB
- PLUS QNB
- REPLICA QNB
- MI QNB
- Health GMC QNB
- BOT QNB
- BOT-REPLICA QNB
- DC QNB
- DC-REPLICA QNB
- Plus Health QNB
- CCM QNB
- Institutional QNB
- Payment QNB
- Premium Plus QNB
- Premium Plus-REPLICA QNB
- Motor Plus QNB

## 🛠️ Setup Instructions

### 1. Frontend Deployment

The dashboard is built with React, TypeScript, and Tailwind CSS. Deploy it to your preferred hosting platform.

### 2. AWS S3 Configuration

Create an S3 bucket to store the `builds.json` file:

```bash
# Create S3 bucket
aws s3 mb s3://your-qnb-builds-bucket --region us-east-1

# Set bucket policy for public read access (adjust for your security needs)
aws s3api put-bucket-policy --bucket your-qnb-builds-bucket --policy file://bucket-policy.json
```

### 3. Bitbucket Pipelines Integration

Add the following repository variables in Bitbucket:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_DEFAULT_REGION`: Your AWS region
- `S3_BUCKET_NAME`: Your S3 bucket name

### 4. Customize Deployment Script

Edit `src/scripts/deployment-script.sh` to match your actual deployment infrastructure:

```bash
# For ECS services
get_build_version() {
    local component=$1
    local env=$2
    aws ecs describe-services --cluster ${env}-cluster --services ${component} \
      --query 'services[0].taskDefinition' --output text | cut -d'/' -f2
}

# For Lambda functions
get_build_version() {
    local component=$1
    local env=$2
    aws lambda get-function --function-name ${component}-${env} \
      --query 'Configuration.Version' --output text
}
```

## 📊 Data Format

The dashboard expects a JSON file with the following structure:

```json
[
  {
    "component": "RAP",
    "env": "prod",
    "version": "v1.3.7",
    "last_updated": "2025-06-08T08:00:00Z",
    "status": "success",
    "deployment_id": "deploy-1234567890"
  }
]
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment Flow

1. **Code Push**: Developer pushes code to repository
2. **Pipeline Trigger**: Bitbucket Pipelines automatically triggers
3. **Application Deployment**: Your app gets deployed to AWS
4. **Build Tracking**: Deployment script collects version information
5. **S3 Update**: `builds.json` file gets updated in S3
6. **Dashboard Refresh**: Frontend automatically fetches latest data

## 🔒 Security Considerations

- Store AWS credentials securely in Bitbucket repository variables
- Configure S3 bucket permissions according to your organization's security policies
- Consider using IAM roles instead of access keys for production deployments
- Implement proper error handling and logging

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions, contact the Digit Insurance Cloud Team.

---

**Built with ❤️ for Digit Insurance Engineering Team**
