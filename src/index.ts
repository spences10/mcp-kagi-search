#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { KagiClient } from './kagi-client.js';

const API_KEY = process.env.KAGI_API_KEY;
if (!API_KEY) {
  throw new Error('KAGI_API_KEY environment variable is required');
}

// We can safely assert this as string since we check for undefined above
const api_key = API_KEY as string;

class KagiSearchServer {
  private server: Server;
  private kagi_client: KagiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'kagi-search',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.kagi_client = new KagiClient(api_key);

    this.setup_tool_handlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setup_tool_handlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'kagi_search',
          description: 'Search the web using Kagi Search API',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query'
              },
              limit: {
                type: 'number',
                description: 'Number of results (default: 10)',
                minimum: 1,
                maximum: 50
              },
              offset: {
                type: 'number',
                description: 'Results offset for pagination',
                minimum: 0
              },
              language: {
                type: 'string',
                description: 'Language filter (e.g., "en")'
              },
              no_cache: {
                type: 'boolean',
                description: 'Bypass cache for fresh results'
              }
            },
            required: ['query']
          }
        },
        {
          name: 'kagi_fastgpt',
          description: 'Get AI-powered search responses using Kagi FastGPT',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Query or prompt for FastGPT'
              },
              cache: {
                type: 'boolean',
                description: 'Use cached responses if available',
                default: true
              },
              web_search: {
                type: 'boolean',
                description: 'Include web search results',
                default: true
              }
            },
            required: ['query']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'kagi_search': {
            const args = request.params.arguments as {
              query: string;
              limit?: number;
              offset?: number;
              language?: string;
              no_cache?: boolean;
            };

            const result = await this.kagi_client.search({
              q: args.query,
              limit: args.limit,
              offset: args.offset,
              language: args.language,
              no_cache: args.no_cache
            });

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          case 'kagi_fastgpt': {
            const args = request.params.arguments as {
              query: string;
              cache?: boolean;
              web_search?: boolean;
            };

            const result = await this.kagi_client.fast_gpt({
              query: args.query,
              cache: args.cache,
              web_search: args.web_search
            });

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof Error) {
          return {
            content: [
              {
                type: 'text',
                text: error.message
              }
            ],
            isError: true
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Kagi Search MCP server running on stdio');
  }
}

const server = new KagiSearchServer();
server.run().catch(console.error);
