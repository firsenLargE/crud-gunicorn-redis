# 🔧 Jenkins Quick Start Guide

## Step 1: Install Jenkins (Ubuntu/Debian)

```bash
# Install Java (required for Jenkins)
sudo apt-get update
sudo apt-get install -y openjdk-11-jdk

# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt-get update
sudo apt-get install -y jenkins

# Start Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Step 2: Access Jenkins

1. Open browser: `http://localhost:8080`
2. Paste the admin password from above
3. Click "Install suggested plugins"
4. Create first admin user
5. Configure Jenkins URL (use `http://your-server-ip:8080`)

## Step 3: Install Essential Plugins

Go to **Manage Jenkins → Manage Plugins → Available Plugins**

Search and install:
```
- Pipeline
- Docker Pipeline
- GitHub Integration
- Email Extension
- Slack Notification
- SonarQube Scanner
- Blue Ocean (optional, better UI)
```

## Step 4: Configure Git & Docker Credentials

### Git SSH Key
1. Generate SSH key: `ssh-keygen -t rsa -b 4096`
2. Add to GitHub: Settings → SSH and GPG keys
3. In Jenkins: Manage Jenkins → Credentials → Add Credentials
   - Kind: SSH Username with private key
   - Username: git
   - Private Key: [paste your private key]

### Docker Registry
1. In Jenkins: Manage Jenkins → Credentials → Add Credentials
   - Kind: Username with password
   - Username: [your docker hub username]
   - Password: [your docker hub token]

## Step 5: Create Pipeline Job

1. Click **New Item**
2. Enter name: `TodoApp-Pipeline`
3. Select **Pipeline**
4. Click **OK**

### Configure Pipeline

In the **Pipeline** section:
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/yourusername/your-repo.git
Credentials: Select your git credentials
Branch Specifier: */main
Script Path: Jenkinsfile
```

## Step 6: Setup GitHub Webhook

**In your GitHub repository:**

1. Go to **Settings → Webhooks → Add webhook**
2. **Payload URL**: `http://your-jenkins-ip:8080/github-webhook/`
3. **Content type**: application/json
4. **Events to trigger**: Push events, Pull requests
5. Click **Add webhook**

## Step 7: Run Your First Build

1. Click **Build Now** on your Pipeline job
2. Watch the build progress in **Console Output**
3. Green checkmark = success ✓
4. Red X = failure ✗

## Step 8: Monitor Builds

- **Blue Ocean view** (better visualization):
  - Click **Open Blue Ocean** link
  - See pipeline stages visually
  - View logs for each stage

## Step 9: Setup Notifications

### Email Notifications
1. Manage Jenkins → Configure System → Email Notification
2. Configure SMTP settings
3. Enable in pipeline: Use `post { }` section

### Slack Integration
1. Install **Slack Notification** plugin
2. Get Slack Bot Token
3. Configure in Jenkins
4. Add to Jenkinsfile: 
```groovy
post {
    failure {
        slackSend(message: "Build failed!", channel: "#deployments")
    }
}
```

## File Structure for Jenkins

```
your-repo/
├── Jenkinsfile                 # ← Required (pipeline definition)
├── docker-compose.yml          # ← Required (for local testing)
├── django-api/
│   ├── Dockerfile              # ← For backend container
│   ├── requirements.txt
│   ├── .env.production          # ← Your production env
│   └── manage.py
├── Crud/Crud/
│   ├── Dockerfile              # ← For frontend container
│   ├── nginx.conf
│   ├── .env.production
│   └── package.json
├── DEPLOYMENT.md               # ← Deployment guide
└── scripts/
    ├── pre-deploy-check.sh     # ← Pre-deployment checks
    └── deploy.sh               # ← Deployment script
```

## Testing Your Jenkinsfile Locally

```bash
# Install Jenkins CLI
wget http://your-jenkins-ip:8080/jnlpJars/jenkins-cli.jar

# Validate Jenkinsfile
java -jar jenkins-cli.jar -s http://localhost:8080 declarative-linter < Jenkinsfile
```

## Common Issues & Solutions

### Issue: "no such file or directory: Jenkinsfile"
**Solution**: Make sure Jenkinsfile exists in root directory and commit it to git

### Issue: "docker: command not found"
**Solution**: 
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: Pipeline hangs on input stage
**Solution**: Check Jenkins UI for input prompt and click "Proceed" or "Abort"

### Issue: "Failed to connect to repository"
**Solution**: 
- Check SSH key is added to GitHub
- Verify git credentials in Jenkins
- Test SSH: `ssh -T git@github.com`

## Scaling Jenkins

### Multiple Executors
- Manage Jenkins → Configure System → Executors: increase from 2 to 4+

### Jenkins Agents (for distributed builds)
- Manage Jenkins → Manage Nodes and Clouds
- Create new agent for specific tasks
- Add labels (e.g., "docker", "production")
- Use in Jenkinsfile: `agent { label 'docker' }`

## Security Best Practices

1. **Change default credentials** immediately
2. **Enable CSRF protection**: Manage Jenkins → Configure Global Security
3. **Use SSH keys** instead of passwords
4. **Store secrets** in Jenkins Credentials, not in code
5. **Enable audit logs**: Manage Jenkins → Configure System → Audit Log
6. **Use environment variables** for sensitive data:
   ```groovy
   environment {
       DB_PASSWORD = credentials('db-password')
   }
   ```

## Useful Jenkins Commands

```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Check Jenkins service status
sudo systemctl status jenkins

# View logs
sudo tail -f /var/log/jenkins/jenkins.log

# Backup Jenkins configuration
tar -czf jenkins-backup.tar.gz /var/lib/jenkins

# Stop Jenkins
sudo systemctl stop jenkins
```

## Next Steps

1. ✅ Setup Jenkins server
2. ✅ Create pipeline job
3. ✅ Test with first build
4. ✅ Setup GitHub webhook for automatic triggers
5. ✅ Configure notifications (email/Slack)
6. ✅ Add deployment stages to Jenkinsfile
7. ✅ Setup production environment
8. ✅ Enable monitoring and logging
9. ✅ Document runbooks

## Resources

- [Jenkins Official Docs](https://www.jenkins.io/doc/)
- [Jenkinsfile Reference](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [GitHub Integration Plugin](https://plugins.jenkins.io/github/)

---

**Questions?** Check Jenkins logs:
```bash
sudo tail -f /var/log/jenkins/jenkins.log
```
