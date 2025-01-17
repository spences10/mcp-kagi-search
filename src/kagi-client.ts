import {
	FastGPTParams,
	FastGPTResponse,
	KagiSearchParams,
	KagiSearchResponse,
} from './types.js';

export class KagiClient {
	private api_key: string;
	private base_url = 'https://kagi.com/api/v0';

	constructor(api_key: string) {
		this.api_key = api_key;
	}

	private async fetch_kagi<T>(
		endpoint: string,
		options: RequestInit,
	): Promise<T> {
		const response = await fetch(`${this.base_url}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bot ${this.api_key}`,
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			const error_message =
				data.error?.message ||
				`HTTP ${response.status}: ${response.statusText}`;
			throw new Error(`Kagi API error: ${error_message}`);
		}

		return data as T;
	}

	async search(
		params: KagiSearchParams,
	): Promise<KagiSearchResponse> {
		const search_params = new URLSearchParams({
			q: params.q,
			...(params.limit && { limit: params.limit.toString() }),
			...(params.offset && { offset: params.offset.toString() }),
			...(params.language && { language: params.language }),
			...(params.no_cache && {
				no_cache: params.no_cache.toString(),
			}),
		});

		return this.fetch_kagi<KagiSearchResponse>(
			`/search?${search_params.toString()}`,
			{ method: 'GET' },
		);
	}

	async fast_gpt(params: FastGPTParams): Promise<FastGPTResponse> {
		return this.fetch_kagi<FastGPTResponse>('/fastgpt', {
			method: 'POST',
			body: JSON.stringify({
				query: params.query,
				cache: params.cache !== false,
				web_search: params.web_search !== false,
			}),
		});
	}
}
