export abstract class HTTPSClientError extends Error {
  readonly statusCode!: number;
  readonly name!: string;

  constructor(message: object | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTPS400Error extends HTTPSClientError {
  readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

export class HTTPS404Error extends HTTPSClientError {
  readonly statusCode = 404;

  constructor(message: string | object = "Not found") {
    super(message);
  }
}

