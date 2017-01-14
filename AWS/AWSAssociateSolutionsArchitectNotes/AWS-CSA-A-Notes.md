External Resources
* linuxacademy.com (Training)
* Acloud.guru (training)
* Read the top-level Documentation and FAQs for all the major AWS resources (EC2, S3, RDS, Auto Scaling, etc). The answers to the "nit-picky" questions can be found here. It's also helpful to go deeper on VPCs and networking-related concepts.
   * VPC http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-vpc.html
   * VPC Security http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Security.html
   * VPC Route Tables http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Route_Tables.html
* Everyone says read the white papers. The ones I read were:
   * Security Best Practices https://d0.awsstatic.com/whitepapers/Security/AWS_Security_Best_Practices.pdf
   * Cloud Best Practices https://d0.awsstatic.com/whitepapers/AWS_Cloud_Best_Practices.pdf
   


Core
* Elasticity
    * Ability to scale up/down on demand
    * Reduce cost
    * Scaling
        * Proactive - fixed interval
        * Proactive Event-based
        * Auto-Scaling based on demand
        * Out: more instances, Up: Bigger instances
        * Fault tolerant
        * Operationally efficient
        * More resources, less resources cost
* Scalability
    * grow over time
    * economies of scale
    * vertically: more powerful resources
    * horizontally: increased number of resources
* Reserved
    * reduced price
    * guaranteed capacity (useful for disaster recovery)
    * within AZ
    * Can submit modification request to
        * change AZ
        * scope up/down AZ to Region
        * instance size w/in same type
* "Tightly Coupled" vs "Loosely Coupled"
    * Tightly
        * one thing fails, all fail
    * Loosely
        * individual component failure won't break everything
        * Can scale out individual components
* Shared Security Model
    * AWS: host OS/Virtualization, physical security
        * DDoS
            * Could use CloudFront to absorb requests
        * Do INGRESS filtering on incoming traffic
    * You: guest OS/VPC on up, security group, software updates, data in transit/rest
        * Also use software-level security: IPTABLES, Firewalls, etc
        * DDoS
            * Block CIDR at Network ACL (Subnet level)
            * Must have permission to do Port Scanning w/in cloud
    * Encryption (AES-256):
        * EBS
            * done on instance itself, not good for small instances
            * snapshots automatically encrypted
        * S3 - at rest
        * Glacier
        * Redshift
        * SQL RDS
            * MySQL//Aurora, Oracle, Postgres, MSSQL
            * Snapshots, backups, read replicas all encrypted
            * SSL connection encryption
* Disaster Recovery
    * Recovery Time Objective (RTO)
        * restore to level of service, measured in time
    * Recovery Point Objective (RPO)
        * acceptable amount of dataloss, measured in time
    * Methodology
        * Pilot light
            * Minimal version of production environment in AWS
            * Scale out and DNS switch if disaster
            * Make sure it's up to date
            * Requires extra time to spin up
        * Warm standby
            * Larger footprint than pilot light
            * Running business critical applications
        * Multi-site
            * clone production environment
            * active-active
            * also use as load balance
            * less downtime, more costly
    * DR Services
        * ELB and Auto Scaling
        * Route53 failover DNS, or latency based
        * Storage Gateway
        * lots of AWS tools to get data, AMIs out of on-premises
    

EC2
* AMI
    * Unique to a Region (need to manually copy to another Region)
    * Permissions: can make public, or available to another AWS account
    * PV Paravirtual 
        * cannot take advantage of hardware extensions
        * historically was faster, but basically no diff now
    * HVM Hardware Virtual - preferred method, on current instance types
    * Copying an image, can encrypt from unencrypted, but default is keep same
* Security Group
    * EC2-Classic: Can't add/remove SGs to running instance
    * VPC: Live in that VPC
    * Stateful: response traffic is allowed
    * 500 Security Groups / VPC, 50 rules/SG, 5 SGs/network interface
    * Can't delete the default security group
    * Instance needs at least one security group
* Dedicated instance - hardware w/ just our stuff
* Elastic Load Balancer
    * Can distribute traffic across AZs
    * Can live in a public subnet and serve traffic to private subnets (eg Auto Scaling Groups)
    * Can apply an SSL directly to it
    * Needs to split between two subnets?
    * Configure
        * What to listen on (80)
        * Apply a Security Group to the ELB
        * Health Check on target instances (eg port 80)
        * target instances
    * Instances Security Groups still need to allow traffic from ELB
        * Instances don't need a Public IP, just a public subnet
        * Requests look like they're from ELB, might want to log traffic at ELB level
    * ELB for Apex domain required Route53 Alias record
    * Internal ONLY accepts traffic from w/in VPC (use w/ private subnet for multi-tier apps)
    * Connection draining: wait for connections to complete
    * Cross Zone load balancing required across AZs
    * AWS will increase ELB as needed
        * Contact AWS for "Prewarming" to handle rapid, drastic spikes in traffic
    * Lots of built in Metrics on the ELB (connections, responses, etc)
        * Can create Alerts off of it
    * Classic: register instances, Application: target group
    * Troubleshooting
        * Make sure target is available for health check (correct "index.html" target)
        * Make sure ELB and Instances have port 80 open
        * Enable Access Logs to Amazon S3 (otherwise ELB logs on Instance)
        * Add specific subnets to ELB
* Auto Scaling Group (ASG)
    * Launch additional instances as needed
        * Load
        * Proactive
        * Event
    * Consists of Launch Configuration + Scaling Plan
    * Spans AZs, not Regions
    * Tell it to receive traffic from an ELB
    * static size = "self healing", or
    * scaling policy to adjust capacity w/ CloudWatch Alarm for Increase and Decrease group size
    * Can use with internal multi-tier apps
    * Deleting ASG terminates running instances
    * Can't pass EC2 instance cap
    * Launch Configuration (LC)
        * Info on the instance that an Auto Scaling Group uses (AMI, instance type, etc)
        * LC can be used w/ multiple ASGs
        * ASG requires an LC
        * Can't modify LC after launch
            * Create new LC, apply to ASG
                * Only affects new instances! Existing are kept.
    * Scaling Plan
        * Tells Auto Scaling when and how to scale
            * Manual
            * Scheduled
            * Demand (In and Out)
                * Alarm - What to look for (via CloudWatch)
                    * Could be SQS Queue Size
                * Policy - how to respond to Alarm
                    * Can't go outside min/max group size
                    * Adjustment Types
                        * ChangeInCapacity (+/-)
                        * ExactCapacity
                        * PercentChangeInCapacity
                    * Scaling Policy Types
                        * Simple
                            * has cooldown
                        * Step
                            * based on size of alarm breach
                            * continuously evaluated
    * Troubleshooting
        * "thrashing" up and down
            * Change thresholds
            * Decrease checking frequency
            * Increase cooldown (not for step or scheduled)
        * doesn't happen
            * max too low
* EBS Volumes
    * cannot cross AZs (auto replicated WITHIN AZ)
        * create snapshot in other AZ to access there
    * IOP is max 256KB
    * SSD General Purpose
        * 1GiB to 16TiB
        * Burstable IOP credits
        * baseline 3 IOPS/GiB
    * Provisioned IOPS
        * 4GiB to 16TiB
        * up to 20,000 IOPS
        * Critical apps requiring sustained IOPS, large DB workloads
    * Magnetic
        * 1Gib to 1024GiB
    * AWS EBS encryption uses AWS Key Management Service (don't use on smaller than m3)
        * Customer Master Key (CMK)
        * Snapshots/Volumes by default inherit status of their source
            * Can't change CMK of volume/snapshot but
            * encrypt > encrypt w/ new CMK w/ copy snapshot
            * unencrypted > encrypt: w/ copy snapshot
            * encrypt > unencrypt: mount both, copy over
        * Can share an encrypted snapshot but using non-default CMK and sharing both w/ other account
    * Snapshots
        * Stored on S3 under the hood (can't see them)
        * incremental in nature (behind the scenes first snapshot might still exist)
        * When creating snapshots of EBS volumes that are configured in a RAID array, it is critical that there is no data I/O to or from the volumes when the snapshots are created
            * freeze filesystem, unmount, or stop instance
* Elastic File System (EFS)
    * NFS for EC2
* EC2 Classic
    * internal IPs are unstable after reboot
* Placement Groups
    * instances w/in same AZ, low latency (close together), min 10 Gbps network
    * stop / start as a group
    * failure is "insufficient capacity error"
    * CAN span peered VPCs, apparently
* Spot Instances
    * If AWS terminates, no charge for last hour (you kill, you pay)
    * The price per instance-hour for a Spot instance is set at the beginning of each instance-hour for the entire hour. Any changes to the Spot price will not be reflected until the next instance-hour begins.

S3
* URL
    * to object bucketname.s3.amazonaws.com/path
    * to static site linuxacademy-big-bucket.s3-website-ap-southeast-2.amazonaws.com
* unlimited storage
    * no limit to number of objects in bucket
* 11 nines durability, 99.99% availability
* Created in a Region, stay there
    * synchronized across all AZ w/in Region automatically
    * new PUT read-after-write consistent
    * overwrite PUT, DELETE eventual consistent
* bucketnames unique across ALL regions
* 100 buckets / account, can't change owner
* Account (not user) owns bucket
* min object size: 0 bytes
* max: 5GB? multipart: 5TB (recc'd > 100MB)
* if rapid increase > 100 PUT/LIST/DELETE or > 300 GET reqs/sec, contact AWS
* CORS configuration
    * JavaScript thing
* Resource Based Policies
    * ACL to share bucket across account
    * Bucket Policy
        * Restrict off IP address, HTTP referrer,
        * Will overwrite "Public Permissions"
        * Can be edited by CloudFront Distributions
        * Use IAM to give a User access to a specific bucket
            * Resource format arn:aws:s3:::bucketname/folder
* User-based Policies
    * IAM
* RRS - Reduced Redundancy Storage
    * 99.99 durability, availability
    * cheaper, for reproducible objects
* Versioning
    * Off by default
    * Once on, can only be suspended, not disabled (old versions continue to exist)
* Lifecycle policies
    * Archive (Glacier) and Delete options
    * Can be applied to Versions

Glacier

VPC
* Spans all AZs in the Region
* Internet Gateway (IGs) attach to VPC
* /28 is smallest possible subnet, /16 largest
    * can't resize (requires redo)
* Subnet
    * Only belongs to one AZ
    * /28 is smallest possible subnet, up to VPC range
        * First 4, last 1 reserved by AWS
    * Route Tables
        * VPC comes w/ main route table
        * Subnet must have route table (only one at a time, implicitly main).
        * Route table can have multiple Subnets
        * Subnet automatically associated with the main route table for the VPC (modifiable)
    * private subnet - no internet gateway
        * public requires IG + Route Table
            * Use when serving traffic to Internet
            * default subnets in default vpc are public (3 of them)
            * Route Table
                * Says all traffic to IG
                * Attach RT to subnet
            * Can set all instances to receive public IP
        * Even in Public, Instances needs Elastic/Public IP to comm w/ internet
            * Use a NAT for a Private Subnet to get updates
        * By default, instances w/in VPC can all communicate w/ e/o regardless of pub/private via "local route"
    * Can assign public IPs by default (routed to private IP (NAT))
    * NAT 
        * NAT Gateway (AWS Provided)
            * Add to Public subnet,
            * Edit Route to Private Subnet (default if not explicit) to all traffic to nat
        * Instance
            * allow an instance in your VPC to initiate outbound connections to the Internet but prevent unsolicited inbound connections from the Internet
            * AWS provides instance types
            * Needs Public Subnet, Public IP
            * SG setting: Allow 80/443 from subnet CIDR
            * Disable source/destination check on EC2 instance
            * Add Route Table to Private Subnet pointing to NAT instance id
* In VPC, reboot keeps internal + elastic IPs (not so for non-ElasticIP public ip classic)
* Network ACLs (firewall at subnet level)
    * Live w/in a VPC. Can associate w/ multiple Subnets (Subnet has at most 1 Network ACL)
    * Block all traffic from an IP/range at Network ACL level
    * "stateless" - return traffic must be allowed through outbound rule
        * Security Groups - stateful, always allow return traffic
    * deny at low number trumps allow at high number (reverse NOT true)
    * increment rules by 10
    * Kind of like a Security Group, but for Subnets
* VPC Peering Connections
    * Can't do across regions (only between AZs in Region)
        * Can do across accounts w/in same Region
    * Can't have overlapping CIDR
    * Can do 1:Many where children can't see each other (not transitive)
    * Can configure Routes to act at VPC or Subnet level, or instance level
        * Edit Route Tables of BOTH VPC/Subnets to point to the PC
    * Only works w/in AWS (can't peer Internal network, use a VPG or DC instead)
    * Can't "cross over" into S3 endpoints
* Virtual Private Gateway
    * VPN connection from Customer Gateway to VPG in VPC
    * Add on-site route tables to AWS Subnet, apply to VPG
    * Could also run OpenVPN (not site-to-site)
        * Works w/ mobile devices that have OpenVPN client
        * Use w/ ElasticIP + backup OpenVPN to support High Availability
* Bastion Host
    * Log in from the web, it has access to private subnet resources
* Limits
    * 5 / VPCs region
        * 1 IG / VPC limit
        * ergo 5 IGs/region
    * 50 customer gateways / region
    * 50 VPN connections /region
    * 200 subnets/VPC
    * 200 Network ACLs/VPC, 20 rules/ACL
    * 200 route tables/VPC, 50 entries/table
    * 5 elastic IP/region
    * 500 Security Groups / VPC, 50 rules/SG, 5 SGs/network interface

RDS
* Automatic point-in-time backups, updates
* Multi-AZ Deployment
    * primary DB instance is synchronously replicated across Availability Zones to the standby replica
    * InnoDB only for MySQL
    * Read replicas for heavy read only traffic
    * avoids need for user-initiated point-in-time restore
* DB Subnet Groups
    * Needs multiple Subnets across (at least two) AZs
    * generally private subnets
    * Use DNS to connect to DB instance; IP can change on failover
* Publicly Accessible needs to be True (plus SG, etc) to be accessible
* Can move VPCs for non-Aurora dbs
* Supported DBs
    * MySQL // Aurora
    * MariaDB
    * Postgres
    * Oracle
    * MSSQL
* 5 GB to 6 TB of storage
* Can't do MySQL Clusters, would need to run on EC2
* RDS does NOT support a cluster of instances w/ load balancing traffic
* Can use ElasticCache clusters for caching db session info
* Shares same Security Groups as EC2
* Can encrypt data at rest
* Can use an SSL certificate for connections
* CNAME can be used w/ Route53 to give it a different DNS name
* Automated Backup
    * automated point in time recovery (serious)
    * default 1 day (free), can be set up to 35
* Snapshots
    * user initiated
* Encryption

DynamoDB
* Fully managed NoSQL (MongoDB): HA, scaling
* Sync'd across AZ within Region
* Dev specifies table throughput
* Document and Key/Value
* Can use SSL
* Use case: User session data

AWS Database Migration Service
* Done while running
* homogenous, heterogenous migrations
* Can stream to Redshift

Redshift
* petabyte-scale data warehouse for BI
    * hRedshift columns = 1024kb
* Supports SQL tools w/ ODBC/JDBC connections (Postgres-based)
* Columnar data store
* Monitors and backups data, can enable encryption

ElasticCache - in-memory data store
* Redis
* Memcached

Amazon Storage Gateway
* Local Storage that backs up to S3
* Gateway-Cached Volumes:
    * iSCSI mounted on-premise. Writes to S3, caches locally. Store all data in S3, cache most-frequently accessed locally.
    * less-limited, only cache data locally, everything else in S3 (cheaper?)
* Gateway-Stored Volumes: 
    * local storage, periodic incremental snapshots
    * limited to the amount of space you allocate to the VM (eg potentially more costly)
* Recommend use w/ Direct Connect

Import/Export
* Mail hard drives
* Example: Baseline data into S3 (use incremental updates over internet)
* Snowball
    * Secure appliance (encrypted)

Direct Connect - dedicated private connection from ISP to AWS
* Not over internet
* Private Virtual Interface
    * Only internal IP addresses inside of EC2
* Public Virtual Interface
    * connect to public AWS endpoints
* Cross Connect
* Alternative to VPN
* 1 to 10 GB

IAM
* Global users, all AWS regions
    * New users start with no permissions
* Federated - can integrate w/ existing LDAP or Kerberos
* Simple Token Service
    * Temporary permissions for users/role
* SAML - integrate w/ active directory
* Groups -
    * Collection of IAM users
    * Deny overrides allow
* Roles - other AWS resources (users, EC2 instances can assume)
    * Identify Provider Access - gran on-premises networks Role access
    * Don't have API credentials (password or access keys)
    * EC2 Instance can only assume ONE Role when it is first created (cannot change or add)
    * Roles are always preferred to API keys
    * Default PowerUser role has access to everything except IAM
    * Delegation requires
        * Trust Policy
        * Permissions Policy
* Temporary Credentials
* Policies
    * Last 5 versions are tracked
* ARN - Amazon Resource Name (includes amazon account id)
* Security Token Service - assume a temporary role, do something (write to database), expires
* Cloudtrail - logs API calls
* Resource-level permissions
    * EC2
    * EBS: attach, delete, detach
    * Could require MFA for actions
* Cannot apply permissions to Root

AWS WAF
* Web application firewall, blocks common attacks (SQL injection, cross-site scripting)

Route53
* Apex of domain is "bare", w/o subdomain "example.com"
    * Route53 can Alias to
        * ELB
        * CloudFront
        * Elastic Beanstalk
        * S3 Bucket configured Static
        * other R53 record in zone
* Routing Policy
    * Simple
    * Latency based routing / multiregion failover
        * "Active-Active"
        * Routes to whichever has lowest latency
        * Requires duplicate architecture (use CloudFormation)
    * Weighted
        * "Active-Active"
        * Probabilistic off weighting
        * Useful for A/B tests
    * Geo-based Routing
        * Compliance w/ laws
    * Failover
        * Active-Passive
        * Example was ELB-Instance failing to CloudFormation-S3

SNS
* Notifications when events occur in AWS
* Topic: what a message is sent to
* Subscription/Subscriber: who/what gets the message
    * SMS, HTTPS,JSON,SQS
* Exists at Region level (e.g., don't pick an AZ)

SQS - Simple Queue Service
* Exists at Region level (e.g., don't pick an AZ)
* Distributed and Decoupled applications (Fault Tolerant)
* Messages up to 256KB
* Default message retention in queue is 4 days
    * Can set to 60s to 14 days
* Standard Queue
    * at-least-once message delivery
* FIFO (First In First Out)
* Maximum inflight messages
    * 120,000 standard
    * 20,000 FIFO
* Default Visibility Timeout is 30s
* Guaranteed delivery
* Order best effort
* Can create an Auto Scaling group for component based off queue size
* Long Polling
    * 1-20s waits for all messages in queue
    * Reduces cost when you get lots of empty responses
    * Queries all servers
* Short Polling (default)
    * increases API requests (increases cost)
    * returns some (not all) messages in queue (queries subset of servers)
* dead-letter queue
    * messages that cannot be processed successfully (poison-pill management)
    * Must be in the same Region as the feeder queue

SWF - Simple Work Flow Service
* Distributed and Decoupled applications (Fault Tolerant)
* coordinates asynchronously across multiple devices
* guaranteed order, no duplicates
* Execution can last up to 1 year
* Activity Task
* Decision Task
* API is task-oriented (SQS is message-oriented)

Amazon API Gateway
* Service to build RESFUL API to expose lambda, http, other 

EMR - Elastic MapReduce
* Hadoop Master/Slave
    * Master, Core, Task Nodes
* Can launch apps on it (Hive, Pig compatible
* Launches a pre-built Hadoop cluster
    * You can login (unlike RDS)
* Input data from S3, DynamoDB, RedShift
    * S3 mounted by default
* Chunk out data into 128MB sizes (default, can be changed)
    * split files loaded into memory
* Preconfigured Hadoop AMI w/ Mappers/Reducers per instance size
* Can use CloudWatch to configure number of workers
* customers may encrypt the input data before they upload it to Amazon S3 (using any common data compression tool); they then need to add a decryption step to the beginning of their cluster when Amazon EMR fetches the data from Amazon S3.

Kinesis
* Collect data from multiple Producers, maintains order
* "Stream" 
    * Preserves for 24hrs default, 7 days max
    * Data blob can be 1 MB
* Run SQL queries on streaming data
* Emit from Kensis Streams to S3, Redshift, EMR, Lambda (Consumers)
* Scale across multiple shards
* Aggregation refers to the storage of multiple records in a Streams record

Elastic Beanstalk
* Uses CloudFormation templates
* Deploy less-complex applications, single tier, core services
    * EC2
    * Auto Scaling
    * ELB
    * RDS
    * SQS
    * CloudFront
* Supported Platforms:
    * Docker
    * Java
    * Windows .NET
    * Node.js
    * PHP
    * Python
    * Ruby
* Don't use if:
    * Need software updates on boot?
* Integrates with version control
* Web server Environment vs Worker Environment
* Deploys an ELB, integrates w/ Route53

CloudFormation - create and provision resources w/ templates
* JSON Templates "infrastructure as code"
* Stack - template that deploys infrastructure
    * Can create from existing application architecture
    * 25 at a time
* Resources
    * AWS things to be launched
* Can configure Parameters that prompt for user input
* "Automatic rollback on error" enabled by default

CloudWatch
* Can be used to shut down inactive instances
* integrates w/ CloudTrail for AWS environment change monitoring
* Only accessible via SSL endpoint
* EC Instances "built in" hypervisor metrics
    * CPU
    * Network I/O
    * Disk Read/Write
* EC Instance custom metrics (non-RDS)
    * disk usage / free
    * swap
    * memory use /free
* Status Check
    * "self healing applications"
* Basic: 5 min, Detailed: 1 min

CloudTrail
* Log any action taken against AWS API, user details of who did it
    * account, IP, time, parameters, response

CloudFront - CDN, uses edge locations to serve data
* Edge Location - AWS datacenter w/o services
* origin (S3 bucket, ELB CNAME) to edge location
* distribution can have multiple origins (by device type)
    * Web or RTMP (Flash media)
    * Restrict Bucket Access: Only accessible via CloudFront, ignore Bucket policy
        * CloudFront adds ACL to Bucket Policy (OAI?)
        * S3 Bucket permissions still apply otherwise
* Private content
    * can create one time use "signed URLs" (or cookies) for private content
        * urls for RTMP, individual files
        * cookies for multiple files, or to not change URLs
    * specify ending datetime (optional: starttime, IP address range)
    * Limit S3 access to just CloudFront
        * Create Origin Access identity (OAI)
        * Give it S3 read permissions, lock out everyone else
* Price Class: varies by geographic spread
* Route53
    * can create alternate cnames for long CloudFront names (eg "cdn.mywebsite.com")
    * Can create two Alias records, one as primary one as failover (eg, ELB to Instance, CloudFront to S3)
        * "Active-Passive"
* caches files until
    * cache expires
    * or overwrite w/ new name
    * or create an "invalidation" (costs, might be cheaper to recreate a new CloudFront distribution & update CNAME)




AWS Config
* Point in time snapshot of AWS
* JSON
* Stores config changes

Trusted Advisor
* Notify you of security holes, High Availability issues, cost, performance
* According to AWS best practices

CloudHSM
* Hardware Security Module
* You can implement in multiple AZs and enable replication
* dedicated hardware to store keys, encryption, etc
* isolated physically, tamper resistant
* Compliance reasons, encrypt data/files
* AWS Engineers don't have access

Key Management Service

AWS CloudSearch
* Upload data, they index and provide a search interface

AWS ElasticSearch Service

ECS EC2 Container Service
* Start/Stop Docker containers

AWS Lambda
* Run code in response to "events"
* AWS handles all scaling
