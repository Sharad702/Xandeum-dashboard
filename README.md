# Xandeum pNode Analytics

<div align="center">
  <img src="https://img.shields.io/badge/Xandeum-pNode%20Analytics-0ca5eb?style=for-the-badge" alt="Xandeum pNode Analytics" />
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/pRPC-Live-22c566?style=for-the-badge" alt="pRPC Live" />
</div>

<br />

A web-based analytics platform for Xandeum pNodes using the official **pRPC API** (`get-pods-with-stats`).

## 🌐 Live pRPC Endpoints

The platform connects to public Xandeum pNodes:

```
http://173.212.203.145:6000/rpc
http://173.212.220.65:6000/rpc
http://161.97.97.41:6000/rpc
http://192.190.136.36:6000/rpc
http://192.190.136.37:6000/rpc
http://192.190.136.38:6000/rpc
http://192.190.136.28:6000/rpc
http://192.190.136.29:6000/rpc
http://207.244.255.1:6000/rpc
```

## 🔌 pRPC API

### Method: `get-pods-with-stats`

**Request:**
```bash
curl -X POST http://173.212.203.145:6000/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods-with-stats",
    "id": 1
  }'
```

**Response:**
```json
{
  "address": "109.199.96.218:9001",
  "is_public": true,
  "last_seen_timestamp": 1765204349,
  "pubkey": "2asTHq4vVGazKrmEa3YTXKuYiNZBdv1cQoLc1Tr2kvaw",
  "rpc_port": 6000,
  "storage_committed": 104857600,
  "storage_usage_percent": 0.02486133575439453,
  "storage_used": 26069,
  "uptime": 3271,
  "version": "0.7.0"
}
```

## ✨ Features

- 📊 **Live pNode data** from Xandeum pRPC
- 💾 **Storage metrics**: committed, used, usage percentage
- ⏱️ **Uptime tracking** for each pNode
- 🔍 **Search & filter** by pubkey, address, status
- 🔄 **Auto-failover** between multiple pRPC endpoints
- 📱 **Responsive design** for all devices

## 🚀 Quick Start

```bash
# Install dependencies
cd "Xandeum Labs"
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Note:** The platform automatically connects to public pNode endpoints. No configuration needed!

## 📡 Data Fields

All data from `get-pods-with-stats`:

| Field | Type | Description |
|-------|------|-------------|
| `pubkey` | string | pNode public key |
| `address` | string | IP:port address |
| `is_public` | boolean | Public/private status |
| `version` | string | Xandeum version |
| `uptime` | number | Uptime in seconds |
| `storage_committed` | number | Committed storage (bytes) |
| `storage_used` | number | Used storage (bytes) |
| `storage_usage_percent` | number | Usage percentage |
| `last_seen_timestamp` | number | Last seen timestamp |
| `rpc_port` | number | RPC port |

## 🏗️ Project Structure

```
Xandeum Labs/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # UI components
│   ├── hooks/usePNodes.ts      # Data fetching
│   └── lib/prpc.ts             # pRPC client
├── package.json
└── README.md
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Main dashboard |
| `/pnodes` | pNode directory |
| `/stats` | Network statistics |
| `/storage` | Storage analytics |
| `/performance` | Performance metrics |
| `/settings` | Configuration |
| `/help` | Documentation |

## 🛠️ Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **Framer Motion** - Animations

## 🔗 Links

- [Xandeum Website](https://xandeum.network)
- [Xandeum Discord](https://discord.gg/uqRSmmM5m)

---

<div align="center">
  Built for Xandeum Labs Bounty
  <br />
  <strong>100% Live Data • No Mock Values • Official pRPC API</strong>
</div>
