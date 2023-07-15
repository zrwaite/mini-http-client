import { DataResponse, DataResponseType } from './types/data'

const HTTPMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const
type HTTPMethodType = typeof HTTPMethods[number]

export const MiniHTTPReq = async(
	url: string,
	method: HTTPMethodType = 'GET',
	body: any = undefined,
	headers: any = { 'Content-Type': 'application/json' },
): Promise<DataResponseType<string>> => {
	if (!HTTPMethods.includes(method)) {
		return DataResponse.fatal('Invalid method')
	}
	try {
		const response = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		})
		const message = await response.text()
		if (!response.ok) {
			return DataResponse.fatal(`${response.status}: ${response.statusText}\n ${message}`)
		}
		return DataResponse.success(message)
	} catch (error: any) {
		return DataResponse.fatal(error)
	}
}

export const MiniHTTPReqParsed = async<T>(
	url: string,
	method: HTTPMethodType = 'GET',
	body: any = undefined,
	headers: any = { 'Content-Type': 'application/json' },
): Promise<DataResponseType<T>> => {
	const res = await MiniHTTPReq(url, method, body, headers)
	if (res.error) {
		return res
	} else {
		try {
			const parsed = JSON.parse(res.data)
			return DataResponse.success(parsed)
		} catch (error: any) {
			return DataResponse.fatal('Failed to parse response: ' + res.data + '\n\n' + error)
		}
	}
}
	
const MiniGraphQLReq = async(
	url: string,
	query: string,
	variables: any = undefined,
): Promise<DataResponseType<string>> => {
	const body = {
		query,
		variables,
	}
	return MiniHTTPReq(url, 'POST', body)
}

export const MiniGraphQLReqParsed = async<T>(
	url: string,
	query: string,
	variables: any = undefined,
): Promise<DataResponseType<T>> => {
	const res = await MiniGraphQLReq(url, query, variables)
	if (res.error) {
		return res
	} else {
		try {
			const parsed = JSON.parse(res.data)
			return DataResponse.success(parsed)
		} catch (error: any) {
			return DataResponse.fatal('Failed to parse response: ' + res.data + '\n\n' + error)
		}
	}
}

export class GraphQLClient {
	constructor(
		public url: string,
	) {}
	request = async<T>(
		query: string,
		variables: any = undefined,
	): Promise<DataResponseType<T>> => {
		return MiniGraphQLReqParsed<T>(this.url, query, variables)
	}
}
