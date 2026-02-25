# ServerlessPostgres (01j6djp2sbh95rp96vf39xtbkf)

Source: ServerlessPostgres (01j6djp2sbh95rp96vf39xtbkf).html

The multi-cloud fully managed Postgres with a generous free tier. We separated storage and compute to offer autoscaling, branching, and bottomless storage.
Get early access
Made for Developers
Compute scales dynamically to ensure that you are ready for peak hours.
Compute scales down to zero on usage and hot storage offloads to S3 for cost efficiency.
On Demand Scalability
We separated storage and compute to make on demand scalability possible. Compute activates on an incoming connection and shuts down to save resources on inactivity.
Compute is fully client-compatible with Postgres because it is Postgres!
As the workload changes Neon adjusts the amount of resources dedicated to the compute.
We designed our storage from the ground up as a fault tolerant scale-out system built for the cloud. It integrates with cloud object stores such as S3 to offload cold data for cost optimization. Our storage architecture ensures high availability, scale out, and unlimited capacity that we call "bottomless".
Our storage implements a "copy-on-write" technique to deliver online checkpointing, branching, and point in time restore. This eliminates expensive "size of data" backup and restore operations required for traditional database as a service systems.
Our storage technology is open source and written in Rust.
Data Branching
Neon allows to instantly branch your Postgres database to support a modern development workflow. You can create a branch for your test environments for every code deployment in your CI/CD pipeline.
Branches are virtually free and implemented using the "copy on write" technique.
Not an ordinary Postgres as a service
Neon provides true cloud native features essential for modern application development.
Neon Cloud provides high availability without a maintenance burden and a need for expert advice.
Incremental auto backup functionality keeps your data safe 24/7.
Perfect for SaaS
SaaS companies use Neon to maximize engineering velocity and minimize the cost. Our serverless architecture minimizes the cost of maintenance for inactive customers. Specifically Neon removes the need to over-provision capacity by fitting the customers into the predefined under-utilized instance sizes.
Get early access
Subscribe to Newsletter