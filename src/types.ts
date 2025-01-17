export interface KagiSearchParams {
  q: string;
  limit?: number;
  offset?: number;
  language?: string;
  no_cache?: boolean;
}

export interface KagiSearchResult {
  rank: number;
  url: string;
  title: string;
  snippet: string;
  relevance_score?: number;
}

export interface KagiSearchResponse {
  meta: {
    id: string;
    node: string;
    ms: number;
    total: number;
  };
  data: {
    results: KagiSearchResult[];
  };
}

export interface FastGPTParams {
  query: string;
  cache?: boolean;
  web_search?: boolean;
}

export interface FastGPTResponse {
  meta: {
    id: string;
    node: string;
    ms: number;
  };
  data: {
    output: string;
    tokens: number;
    references?: {
      title: string;
      url: string;
      snippet?: string;
    }[];
  };
}

export interface KagiError {
  error: {
    code: string;
    message: string;
  };
}
