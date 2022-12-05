# Database 

The current iteration uses flat files but we are migrating to Postgres via the Cloudflare workers API and using the Neon Technical Preview Postgres hosting service. 

Current databsse table schemas 

#### Sensor Data Table
```sql 
create TABLE data (
  id BIGSERIAL PRIMARY KEY, 
  data REAL NOT NULL,
  mac INTEGER NOT NULL,
  timestamp BIGINT NOT NULL,
  type SMALLINT NOT NULL  
)
```
#### Schools table
```sql 
create TABLE schools (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	aretas_id VARCHAR(50) NOT NULL, 
	latitude FLOAT NOT NULL, 
	longitude FLOAT NOT NULL
)
```
#### Sensors 

```sql 
create TABLE sensors (
	id SERIAL PRIMARY KEY,
	school_id INT NOT NULL,
	mac INTEGER NOT NULL,
	room VARCHAR(24),
	floor VARCHAR(24),
	building VARCHAR(24)
)
```

