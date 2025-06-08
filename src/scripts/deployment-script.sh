
#!/bin/bash

# QNB Build Version Tracker - Deployment Script
# This script should be integrated into your Bitbucket Pipelines

set -e

# Configuration
S3_BUCKET="your-qnb-builds-bucket"
BUILDS_FILE="builds.json"
AWS_REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 QNB Build Version Tracker - Deployment Script${NC}"
echo "=================================================="

# Function to log with timestamp
log() {
    echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to get build version from deployment
get_build_version() {
    local component=$1
    local env=$2
    
    # Replace this with your actual logic to fetch build versions
    # This could be from AWS ECS, Lambda, or your deployment system
    
    # Example for ECS service:
    # aws ecs describe-services --cluster ${env}-cluster --services ${component} \
    #   --query 'services[0].taskDefinition' --output text | cut -d'/' -f2
    
    # Example for Lambda:
    # aws lambda get-function --function-name ${component}-${env} \
    #   --query 'Configuration.Version' --output text
    
    # For demo purposes, return a mock version
    echo "v$(date +%s | tail -c 4).$(( RANDOM % 10 )).$(( RANDOM % 10 ))"
}

# Function to get deployment status
get_deployment_status() {
    local component=$1
    local env=$2
    
    # Replace with your actual status check logic
    # This could check ECS service status, Lambda function status, etc.
    
    # Example for ECS:
    # aws ecs describe-services --cluster ${env}-cluster --services ${component} \
    #   --query 'services[0].status' --output text
    
    # For demo, return random status
    local statuses=("success" "pending" "failed")
    echo ${statuses[$((RANDOM % 3))]}
}

# QNB Components to track
QNB_COMPONENTS=(
    "RAP"
    "Prod-API-QNB"
    "Replica-Quote-QNB"
    "AGGR"
    "DIRECT-QNB"
    "PLUS-QNB"
    "REPLICA-QNB"
    "MI-QNB"
    "Health-GMC-QNB"
    "BOT-QNB"
    "BOT-REPLICA-QNB"
    "DC-QNB"
    "DC-REPLICA-QNB"
    "Plus-Health-QNB"
    "CCM-QNB"
    "Institutional-QNB"
    "Payment-QNB"
    "Premium-Plus-QNB"
    "Premium-Plus-REPLICA-QNB"
    "Motor-Plus-QNB"
)

# Environments
ENVIRONMENTS=("prod" "pre-prod")

log "${YELLOW}Collecting build information...${NC}"

# Create JSON array
echo "[" > $BUILDS_FILE

first=true
for component in "${QNB_COMPONENTS[@]}"; do
    for env in "${ENVIRONMENTS[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> $BUILDS_FILE
        fi
        
        version=$(get_build_version "$component" "$env")
        status=$(get_deployment_status "$component" "$env")
        timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        
        log "  📦 $component ($env): $version [$status]"
        
        cat >> $BUILDS_FILE << EOF
  {
    "component": "$component",
    "env": "$env",
    "version": "$version",
    "last_updated": "$timestamp",
    "status": "$status",
    "deployment_id": "deploy-$(date +%s)-$component-$env"
  }EOF
    done
done

echo "" >> $BUILDS_FILE
echo "]" >> $BUILDS_FILE

log "${GREEN}✅ Build information collected${NC}"

# Validate JSON
if ! python3 -m json.tool $BUILDS_FILE > /dev/null 2>&1; then
    log "${RED}❌ Invalid JSON generated${NC}"
    exit 1
fi

log "${YELLOW}Uploading to S3...${NC}"

# Upload to S3
if aws s3 cp $BUILDS_FILE s3://$S3_BUCKET/$BUILDS_FILE --region $AWS_REGION; then
    log "${GREEN}✅ Successfully uploaded to S3${NC}"
else
    log "${RED}❌ Failed to upload to S3${NC}"
    exit 1
fi

# Set public read permissions (optional, adjust based on your security requirements)
aws s3api put-object-acl --bucket $S3_BUCKET --key $BUILDS_FILE --acl public-read --region $AWS_REGION

log "${GREEN}🎉 QNB Build Dashboard updated successfully!${NC}"
log "Dashboard URL: https://your-dashboard-domain.com"
log "S3 URL: https://$S3_BUCKET.s3.$AWS_REGION.amazonaws.com/$BUILDS_FILE"

# Clean up
rm $BUILDS_FILE
