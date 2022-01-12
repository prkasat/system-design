# Top down steps for system design in an interview
1. Gather functional requirements.
2. Bucketize the functional requirements into microservices.

Example: URL shortener:
 APIs according to functional requirements:
Given long URL → get unique, short URL Given short URL → get back long URL
Both touch the same data. So one microservice, hence depth-oriented problem (What if user had to login to create unique, short URL?)

3. Draw the logical architecture
- A block diagram with one block for each microservice 
- Draw and explain the data/logic flow between them 
- Rules of thumb:
  If the client (user or microservice) is waiting for response from the microservice, use HTTP/REST APIs
  If the client microservice does not expect an immediate response from the server microservice, use a message queue (pub-sub) which is its own microservice.

4. Deep dive into each microservice
Every microservice consists of (upto) three tiers:
App/Compute tier: handles application logic
Cache tier: for high-throughput data access and in-memory compute 
Storage tier: for data persistence

url generation methods:

1. naive counter method
2. sophisticated counter by mapping it to base64 to reduce length of the hash
3. generate random/unpredicatable short url in 3 ways:
    - generate random string
    - timestamp
    - cryptographic hash function + timestamp/counter
4. sicne short url generation doesn't depend on long url, we can pregenerate short url's and store them in advance
 
 How do I convert my program into a (μ)service?
- Listen to requests over the network (in what language? At what address?)
- Would running multiple copies of the program help?
- How would they access the shared hash table / counter?
- If you use a database, how would a hash table and counter be maintained in a database? (Note: Flexibility of representation in RAM is lost when you store the data on disk)
- Does it matter which copy of the program serves the request?
- What if incoming requests and outgoing responses are bursty?
- Are the above functions specific to your application? (If not, then maybe a web server framework can be used? Examples?)
 
How is the data stored in disk ?
 - in memory we can access arbitrary location and therefore we can use hashmap or other data structures
 - when data is stored is disk, contiguous access is better as arbitrary access requires disk seek, which would be expensive.
 - data could be stored in an append only data file on disk. search would be expensive though.
 - use hash index (key - longurl, value - offset in the file) for faster access to data on disk - given a short url, get the location of the long url record on disk


4b. Gather Non-functional / Capacity requirements and check whether & how to scale each tier.
  Bitly numbers:
  2.3 billion links created every year (~ 73 QPS)
  20 billion clicks per month (~ 7700 QPS)
  read: write ~ 100: 1 - read heavy system
  (Research such numbers for as many popular architectures as you can) So clicks:write ratio is 100:1
  Scale up the solution now to handle these numbers.
  
Reasons we may need to go for distributed system:
1. huge data size
2. large no. of requests per second - throughput
3. response time is high need to parallelize the computation
4. single point of failure - availability/reliability in face of faults
5. high latency for users on the other side of the world - geolocation: minimize n/w latency by using multiple servers at different locations
6. hotspots: disproportionately high load on a piece of data


data size:
how many k-v pairs ? 
  2.3 billion links created every year (~ 73 QPS)
  20 billion clicks per month (~ 7700 QPS)

estimate storage for 3 yrs = 365 * 3 ~ 1000 days
no of secs per day = 24 * 60 * 60  = 864000 ~ 100000
no of secs in 3 yrs = 1000 * 100000 = 10^8
no of k-v pairs = 73 ~ 100 * 10^8 = 10 * 10^9 = 10 billion k-v pairs 

size of each k-v pair ?

2048 chars - length of long url = 2KB - 1 char is 1 byte

length of short url -> no of chars in base64 we need to represent counter:
10 ^ 3 ~ 2 ^ 10 - need 10 bits to represent in binary - 1000
10 ^ 9 ~ 2 ^ 30 - need 30 bits to represent in binary - 1 billion
2 ^ 31  - 2 billion
2 ^ 32 - 4 billion
2 ^ 33 - 8 billion
2 ^ 34 - 16 billion
need 34 bits to represent counter value of 10 billion
need to convert 34 bits to base 64 by using 6 digits( 2 ^ 6 = 64)  for 1 base64 char -> 34 / 6 ~ 6 chars
so, 6 chars to represent short url, which is 6 bytes 

since 6 bytes is much less than 2 KB, size of each k-v pair can be approximated as 2KB
total storage over 3 yrs = 2 * 10 ^ 3 * 10 ^ 10 = 2 * 10 ^ 12 = 20 TB

data size for cache:
rule of thumb:
  10% of db entries in cache - 90% hit rate
  20-30% of db entries in cache - 98-99% hit rate

  20% of 20TB = 4TB ( 2 billion k - v pairs)

  each commodity server by rule of thumb can have 128 GB RAM
  so need 4 TB / 128 GB ~ 30 shards server for cache and it 3x replication that results in 90 cache shard servers





