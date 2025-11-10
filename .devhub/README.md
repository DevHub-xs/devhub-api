# DevHub API - DevOps Configuration

This directory contains all CI/CD, deployment, and infrastructure configurations for the DevHub API.

## Structure

```
.devhub/
├── ci/                          # CI/CD Pipeline configurations
│   ├── development/
│   │   └── github-actions.yml
│   ├── certification/
│   │   └── github-actions.yml
│   └── production/
│       └── github-actions.yml
│
├── deployment/                  # Deployment configurations
│   ├── development/
│   │   ├── docker/
│   │   ├── kubernetes/
│   │   └── .env.example
│   ├── certification/
│   │   ├── docker/
│   │   ├── kubernetes/
│   │   ├── render/
│   │   ├── aws/
│   │   ├── mongodb-atlas.json
│   │   └── .env.example
│   └── production/
│       ├── docker/
│       ├── kubernetes/
│       ├── render/
│       ├── aws/
│       ├── mongodb-atlas.json
│       └── .env.example
│
├── scripts/                     # Deployment automation scripts
│   ├── deploy-dev.sh
│   ├── deploy-cert.sh
│   └── deploy-prod.sh
│
└── docs/                        # DevOps documentation
    ├── CI_CD_SETUP.md
    ├── DEPLOYMENT_GUIDE.md
    └── TROUBLESHOOTING.md
```

## Quick Start

### Local Development
```bash
bash .devhub/scripts/deploy-dev.sh
```

### Certification Deployment
```bash
export DEPLOY_TARGET=k8s  # or 'render'
bash .devhub/scripts/deploy-cert.sh
```

### Production Deployment
```bash
export DEPLOY_TARGET=k8s  # or 'aws'
bash .devhub/scripts/deploy-prod.sh
```

## Documentation
- [CI/CD Setup](.devhub/docs/CI_CD_SETUP.md)
- [Deployment Guide](.devhub/docs/DEPLOYMENT_GUIDE.md)
- [Troubleshooting](.devhub/docs/TROUBLESHOOTING.md)

## Environment Files
Environment-specific configurations are in:
- `deployment/development/.env.example`
- `deployment/certification/.env.example`
- `deployment/production/.env.example`

Copy these to create actual `.env.*` files in the project root.
