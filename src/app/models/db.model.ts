export class Limit {
    start?: number;
    page?: number;
    size?: number;
}

export enum Statement {
    DELETE = 0,
    INSERT = 1,
    UPDATE = 2
}

export class DBCommand {
    action?: Statement; // 0 = delete, 1 = insert, 2 = update
    table?: string;
    fields?: string[];
    values?: DBValue[];
    data?: any;
    filter?: any;
    limit?: Limit;
}

export class DBTable {
    name?: string;
    fields?: DBField[];
    mapping?: DBFieldMapping[];
}

export class DBField {
    name?: string;
    unique?: boolean;
}

export class DBFieldMapping {
    data_field?: string;
    db_field?: string;
}

export class DBValue {
    name?: string;
    value?: any;
}