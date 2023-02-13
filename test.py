import redis 

redis_service = redis.Redis(
    host='localhost',
    port=6379,
    password=''
)

redis_service.set('456', 'quangnh')
print(redis_service.get('456'))