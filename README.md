# mcp-kagi-search

---

## ⚠️ Notice

**This repository is no longer maintained.**

The functionality of this tool is now available in [mcp-omnisearch](https://github.com/spences10/mcp-omnisearch), which combines multiple MCP tools in one unified package.

Please use [mcp-omnisearch](https://github.com/spences10/mcp-omnisearch) instead.

---

A Model Context Protocol (MCP) server that provides access to Kagi's premium search and AI capabilities, offering high-quality search results without ads or tracking and AI-powered responses with source citations.

⚠️ The Search API is in closed beta and is currently available to Kagi Business (Team) plan users ⚠️

## Features

- 🔍 Access to Kagi's premium search engine:
  - Ad-free, privacy-focused search results
  - High-quality content prioritization
  - Comprehensive web coverage
- 🤖 AI-powered search responses via FastGPT:
  - Detailed answers to complex questions
  - Source citations for fact verification
  - Web search integration
- 🔄 Efficient response formatting:
  - Clean, structured JSON responses
  - Relevant metadata included
  - Easy to parse for AI consumption
- 🏗️ Built on the Model Context Protocol

## Configuration

This server requires configuration through your MCP client. Here are examples for different environments:

### Cline Configuration

Add this to your Cline MCP settings:

```json
{
  "mcpServers": {
    "mcp-kagi-search": {
      "command": "node",
      "args": ["/path/to/mcp-kagi-search/dist/index.js"],
      "env": {
        "KAGI_API_KEY": "YOUR_KAGI_API_KEY_HERE"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Claude Desktop with WSL Configuration

For WSL environments, add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "mcp-kagi-search": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c",
        "KAGI_API_KEY=your-api-key-here node /path/to/mcp-kagi-search/dist/index.js"
      ]
    }
  }
}
```

### Environment Variables

The server requires the following environment variables:

- `KAGI_API_KEY` (required): Your Kagi API key

## API

The server implements MCP Tools:

### Tools

#### kagi_search

Search the web using Kagi Search API. Returns high-quality search results without ads or tracking. Use this tool when you need factual information from the web, especially for recent events, technical topics, or when you need multiple sources.

Parameters:

- `query` (string, required): Search query
- `limit` (number, optional): Number of results (default: 10, max: 50)
- `offset` (number, optional): Results offset for pagination
- `language` (string, optional): Language filter (e.g., "en")
- `no_cache` (boolean, optional): Bypass cache for fresh results

Example Usage:

```json
{
  "query": "svelte framework",
  "limit": 5,
  "language": "en"
}
```

Response Format:

```json
{
  "meta": {
    "total_results": 24,
    "api_balance": 11.87
  },
  "results": [
    {
      "title": "Svelte • Web development for the rest of us",
      "url": "https://svelte.dev/",
      "snippet": "Svelte is a UI framework that uses a compiler...",
      "published": null
    },
    // More results...
  ]
}
```

#### kagi_fastgpt

Get AI-powered search responses using Kagi FastGPT. Returns a comprehensive answer with citations to source material. Use this tool when you need a detailed answer to a specific question with references to back up the information.

Parameters:

- `query` (string, required): Query or prompt for FastGPT
- `cache` (boolean, optional): Use cached responses if available (default: true)
- `web_search` (boolean, optional): Include web search results (default: true)

Example Usage:

```json
{
  "query": "What is Svelte framework and how does it differ from React?"
}
```

Response Format:

```json
{
  "answer": "**Svelte** is a modern JavaScript framework designed for building web applications...",
  "sources": [
    {
      "title": "Overview • Docs • Svelte",
      "url": "https://svelte.io/docs/svelte/overview",
      "snippet": "You can use it to build anything on the web..."
    },
    // More sources...
  ],
  "meta": {
    "api_balance": 11.87
  }
}
```

## Development

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run in development mode:

```bash
npm run dev
```

### Publishing

1. Update version in package.json
2. Build the project:

```bash
npm run build
```

3. Publish to npm:

```bash
npm publish
```

## Troubleshooting

### API Credits

If you receive an error like "Insufficient credit to perform this request", you need to allocate more API credits:

1. Go to [API Billing](https://kagi.com/settings?p=billing_api)
2. Add more credits to your account

### API Access

The Search API is in closed beta and currently available only to Kagi Business (Team) plan users. If you don't have access, consider using the FastGPT API which is available to all Kagi users with API credits.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on the [Model Context Protocol](https://github.com/modelcontextprotocol)
- Powered by [Kagi Search](https://kagi.com)
