export class DataError {
	constructor(
		public message: string,
		public level: 'fatal'|'warning'
	) {}
	static fatal(message: string): DataError {
		return new this(message, 'fatal')
	}
	static warning(message: string): DataError {
		return new this(message, 'warning')
	}
}

export type DataResponseType<T> = {
	success: false;
	data?: undefined;
	error: DataError;
} | {
	success: true;
	data: T;
	error?: undefined;
}

export class DataResponse {
	static success<T>(data: T): DataResponseType<T> {
		return {
			success: true,
			data,
		}
	}
	static error<T>(error: DataError): DataResponseType<T> {
		return {
			success: false,
			error,
		}
	}
	static fatal<T>(message: string): DataResponseType<T> {
		return DataResponse.error(DataError.fatal(message))
	}
	static warning<T>(message: string): DataResponseType<T> {
		return DataResponse.error(DataError.warning(message))
	}
}
