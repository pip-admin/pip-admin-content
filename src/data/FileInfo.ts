export class File {
    /* Identification */
    public id: string;
    public group: string;
    public name: string;

    /* Content */
    public description: string;
    public content_id: string;
    public content_uri: string;
    public thumbnail_id: string;
    public thumbnail_uri: string;
    public create_time: Date;
    public expire_time: Date;
    public attributes: any;//StringValueMap;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;


}

