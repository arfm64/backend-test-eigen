// src/errors/CustomError.ts
export class CustomError extends Error {
    public data: any;

    constructor(message: string, data: any) {
        super(message);
        this.data = data;
        this.name = "CustomError";
    }
}
