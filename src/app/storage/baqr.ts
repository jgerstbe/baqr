import { v4 as uuidv4 } from 'uuid';

export class baQR {
    public uuid: string;
    public type: string;
    public vCard: any;
    public timestamp: number | Date;

    constructor(vcard: any, uuid: string = uuidv4(), type: string = 'offline', timestamp: number = new Date().getTime()) {
        this.uuid = uuid;
        this.vCard = vcard;
        this.type = type;
        this.timestamp = timestamp;
    }
}