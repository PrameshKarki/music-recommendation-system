import * as bcrypt from "bcryptjs";

export class BcryptService {
    constructor() { }

    async hash(data: string): Promise<string> {
        return await bcrypt.hash(data, 10);

    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return await bcrypt.compare(data, encrypted);
    }

}