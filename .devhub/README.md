# .devhub/

This folder contains DevHub-generated status information for your project.

## Structure

```
.devhub/
├── deployment.yaml    # Deployment status (dev/cert/prod)
├── security.yaml      # Security scans & compliance
├── quality.yaml       # Code quality & tests
└── integration.yaml   # External services status
```

## Purpose

**Like `.git/` for Git, `.devhub/` is for DevHub**

Browse these files to understand:
- 🚀 **Deployment** - What's deployed where
- 🔒 **Security** - Vulnerabilities & compliance
- ✅ **Quality** - Test coverage & code health
- 🔗 **Integration** - External services status

## Usage

```bash
# Check deployment status
cat .devhub/deployment.yaml

# Review security issues
cat .devhub/security.yaml

# View code quality
cat .devhub/quality.yaml

# Monitor integrations
cat .devhub/integration.yaml
```

## Important

⚠️ **Do not manually edit these files**

They are generated and updated by the DevHub platform based on your `devhub.config.yaml`.

