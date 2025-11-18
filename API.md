# API Documentation

## Base URL
```
http://localhost:3000/api
```

For production, use your deployed bot URL.

## Authentication
Currently, the API uses basic authentication. In production, implement JWT tokens for secure access.

## Endpoints

### Health Check
Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok"
}
```

---

### Get Streamer Data
Retrieve streamer information including balance and statistics.

**Endpoint:** `GET /api/streamer/:userId`

**Parameters:**
- `userId` (string) - Discord user ID

**Response:**
```json
{
  "balance": 1250,
  "stats": {
    "totalVideos": 42,
    "totalStreamHours": 156,
    "totalViews": 15234,
    "credits": 1250
  }
}
```

**Error Response:**
```json
{
  "error": "Internal server error"
}
```

---

### Get Leaderboard
Retrieve top streamers for a specific period.

**Endpoint:** `GET /api/leaderboard?period=week`

**Query Parameters:**
- `period` (string, optional) - "week" or "month" (default: "week")

**Response:**
```json
[
  {
    "rank": 1,
    "username": "StreamerPro",
    "videos": 25,
    "streamHours": 48,
    "credits": 2500
  },
  {
    "rank": 2,
    "username": "GamingKing",
    "videos": 22,
    "streamHours": 45,
    "credits": 2200
  }
]
```

**Error Response:**
```json
{
  "error": "Internal server error"
}
```

---

### Get Platform Rules
Retrieve streaming requirements for all platforms or a specific platform.

**Endpoint:** `GET /api/rules?platform=youtube`

**Query Parameters:**
- `platform` (string, optional) - Platform name (youtube, twitch, tiktok, kick, instagram, facebook)

**Response (single platform):**
```json
{
  "platform": "youtube",
  "minVideosPerWeek": 3,
  "minStreamHoursPerWeek": 10,
  "contentType": "Gaming/Entertainment",
  "requirements": [
    "Content must be family-friendly",
    "No copyright violations",
    "Minimum 720p resolution",
    "Regular upload schedule"
  ]
}
```

**Response (all platforms):**
```json
[
  {
    "platform": "youtube",
    "minVideosPerWeek": 3,
    "minStreamHoursPerWeek": 10,
    "contentType": "Gaming/Entertainment",
    "requirements": [...]
  },
  {
    "platform": "twitch",
    "minVideosPerWeek": 0,
    "minStreamHoursPerWeek": 15,
    "contentType": "Live Gaming",
    "requirements": [...]
  }
]
```

---

### Get Rewards Catalog
Retrieve available rewards from the store.

**Endpoint:** `GET /api/rewards?category=gift`

**Query Parameters:**
- `category` (string, optional) - Filter by category (rank, promotion, service, gift, tools, coaching)

**Response:**
```json
[
  {
    "id": "gift_1",
    "name": "Steam Gift Card $10",
    "nameAr": "بطاقة هدايا Steam بقيمة 10 دولار",
    "description": "$10 Steam Gift Card",
    "descriptionAr": "بطاقة هدايا Steam بقيمة 10 دولار",
    "cost": 1500,
    "category": "gift",
    "available": true
  }
]
```

---

### Get Credit Transaction History
Retrieve transaction history for a user.

**Endpoint:** `GET /api/credits/:userId/history?limit=50`

**Parameters:**
- `userId` (string) - Discord user ID

**Query Parameters:**
- `limit` (number, optional) - Maximum number of transactions to return (default: 50)

**Response:**
```json
[
  {
    "userId": "123456789",
    "amount": 100,
    "type": "earn",
    "reason": "Published new video",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  {
    "userId": "123456789",
    "amount": -500,
    "type": "spend",
    "reason": "Redeemed reward: Video Promotion",
    "timestamp": "2024-01-14T15:20:00.000Z"
  }
]
```

---

## Webhook Events

The bot can send webhook notifications to your dashboard for real-time updates.

### Stream Start Event
```json
{
  "event": "stream_start",
  "userId": "123456789",
  "username": "StreamerPro",
  "platform": "twitch",
  "timestamp": "2024-01-15T20:00:00.000Z"
}
```

### Video Published Event
```json
{
  "event": "video_published",
  "userId": "123456789",
  "username": "StreamerPro",
  "platform": "youtube",
  "title": "Epic Gaming Moments",
  "url": "https://youtube.com/watch?v=...",
  "timestamp": "2024-01-15T18:00:00.000Z"
}
```

### Credit Transaction Event
```json
{
  "event": "credit_transaction",
  "userId": "123456789",
  "amount": 100,
  "type": "earn",
  "reason": "Published new video",
  "newBalance": 1350,
  "timestamp": "2024-01-15T18:05:00.000Z"
}
```

### Milestone Achieved Event
```json
{
  "event": "milestone",
  "userId": "123456789",
  "username": "StreamerPro",
  "milestone": "100 videos published",
  "timestamp": "2024-01-15T19:00:00.000Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per IP address

Exceeding these limits will result in a 429 Too Many Requests response.

---

## CORS

The API has CORS enabled for all origins in development. In production, configure allowed origins in the environment variables.

---

## Best Practices

1. **Cache responses** - Implement caching on the dashboard side to reduce API calls
2. **Use webhooks** - Subscribe to webhook events for real-time updates instead of polling
3. **Handle errors** - Always implement proper error handling for API calls
4. **Authenticate requests** - Use JWT tokens in production for secure API access
5. **Monitor usage** - Keep track of API usage to stay within rate limits

---

## Example Integration (Dashboard)

```typescript
// Example: Fetch streamer data
async function getStreamerData(userId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/streamer/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching streamer data:', error);
    return null;
  }
}

// Example: Fetch leaderboard
async function getLeaderboard(period: 'week' | 'month' = 'week') {
  try {
    const response = await fetch(`http://localhost:3000/api/leaderboard?period=${period}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
```
