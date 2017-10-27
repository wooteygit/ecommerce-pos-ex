import 'rxjs/add/operator/toPromise';

import { Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { DBCommand, DBTable, DBField, DBValue, DBFieldMapping, Statement } from '../models/db.model';

import { Config } from '../../environments/environment';

declare var db: any;
declare var openDatabase: any;

@Injectable()
export class DBService {
    db: any;

    private toArray(rows: any): any[] {
        let arr: any[] = [];
        for (let i = 0; i < rows.length; i++) {
            let row = (rows.item) ? rows.item(i) : rows[i];
            arr.push(row);
        }
        return arr;
    }

    init(): void {
        this.db = openDatabase('db', '1.0', Config.StoragePrefix + 'DB', Config.DBSize * 1024 * 1024);
    }

    dropDatabase(): Promise<any> {
        if (!this.db) {
            this.init();
        }

        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM sqlite_master WHERE name NOT LIKE 'sqlite\\_%' escape '\\' AND name NOT LIKE '\\_%' escape '\\'";
            this.execCommand(query).then(res => {
                this.db.transaction(tx => {
                    for (let i = 0; i < res.rows.length; i++) {
                        let name = res.rows[i].tbl_name;
                        tx.executeSql('DROP TABLE IF EXISTS ' + name, []);
                    }
                }, reject, resolve);
            }).catch(res => {
                reject(res);
            });
        });
    }

    create(table: DBTable, clean: boolean = false): Promise<any> {
        if (!this.db) {
            this.init();
        }

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {
                let fields: string[] = [];
                for (let i of table.fields) {
                    if (i.unique) {
                        fields.push(i.name + " unique");
                    }
                    else {
                        fields.push(i.name);
                    }
                }
                
                if (clean) {
                    tx.executeSql(`DROP TABLE IF EXISTS ${table.name}`, []);
                }

                tx.executeSql(`CREATE TABLE IF NOT EXISTS _table_infos (name, field)`, []);
                tx.executeSql(`CREATE TABLE IF NOT EXISTS ${table.name} (${fields.join(',')})`, []);
                tx.executeSql(`DELETE FROM _table_infos WHERE name=?`, [table.name]);
                for (let i of table.fields) {
                    tx.executeSql(`INSERT INTO _table_infos (name, field) values (?, ?)`, [
                        table.name,
                        i.name
                    ]);
                }
            }, reject, resolve);
        });
    }

    load(table: DBTable, data: any[]): Promise<any> {
        if (!this.db) {
            this.init();
        }

        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                let mapping: DBFieldMapping[] = table.mapping;
                let fields: string[] = [];
                let symbols: string[] = [];
                for (let i of table.mapping) {                    
                    fields.push(i.db_field);
                    symbols.push('?');
                }

                tx.executeSql(`DELETE FROM ${table.name}`, []);
                for (let d of data) {  
                    let values: any[] = [];
                    for (let i of table.mapping) {                                            
                        values.push(eval('d.' + i.data_field));
                    }                  
                    tx.executeSql(`INSERT INTO ${table.name} (${fields.join()}) VALUES (${symbols.join()})`, values);
                }                
            }, reject, resolve)
        });
    }

    drop(table: DBTable): Promise<any> {
        if (!this.db) {
            this.init();
        }

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {
                let cmd: string = `DROP TABLE IF EXISTS ${table.name}`;
                tx.executeSql(cmd, []);
            }, reject, resolve);
        });
    }

    find(cmd: DBCommand): Promise<any> {
        if (!this.db) {
            this.init();
        }

        let self = this;

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {
                let fields: string[] = [];
                let wheres: string[] = ["(1=1)"];
                let values: any[] = [];

                if (cmd.fields) {
                    fields = cmd.fields;
                }
                else {
                    fields.push('*');
                }

                if (cmd.filter) {
                    for (let i in cmd.filter) {
                        wheres.push(`${i}=?`);
                        values.push(cmd.filter[i]);
                    }
                }

                let limit = "";
                if (cmd.limit) {
                    if (cmd.limit.size == null) {
                        cmd.limit.size = Config.PageSize;
                    }
                    if (cmd.limit.start == null) {
                        if (cmd.limit.page > 0) {
                            cmd.limit.start = (cmd.limit.page - 1) * cmd.limit.size;
                        }
                        else {
                            cmd.limit.start = 0;
                        }
                    }

                    limit = `LIMIT ${cmd.limit.start},${cmd.limit.size}`;
                }

                tx.executeSql(`SELECT ${fields} FROM ${cmd.table} WHERE ${wheres.join(" AND ")} ${limit}`, values,
                    function (t, r) {
                        resolve(self.toArray(r.rows));
                    },
                    function (t, e) {
                        reject(e);
                    });
            });
        });
    }

    execCommand(sql: string): Promise<any> {
        if (!this.db) {
            this.init();
        }

        let self = this;

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {

                tx.executeSql(sql, [],
                    function (t, r) {
                        resolve({
                            affected: r.rowsAffected,
                            rows: self.toArray(r.rows)
                        });
                    },
                    function (t, e) {
                        reject(e);
                    });
            });
        });
    }

    count(cmd: DBCommand): Promise<any> {
        if (!this.db) {
            this.init();
        }

        let self = this;

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {
                let fields: string[] = [];
                let wheres: string[] = ["(1=1)"];
                let values: any[] = [];

                if (cmd.fields) {
                    fields = cmd.fields;
                }
                else {
                    fields.push('*');
                }

                if (cmd.filter) {
                    for (let i in cmd.filter) {
                        wheres.push(`${i}=?`);
                        values.push(cmd.filter[i]);
                    }
                }

                tx.executeSql(`SELECT COUNT(*) as c FROM ${cmd.table} WHERE ${wheres.join(" AND ")}`, values,
                    function (t, r) {
                        resolve(parseInt(r.rows[0].c));
                    },
                    function (t, e) {
                        reject(e);
                    });
            });
        });
    }

    exec(cmds: DBCommand[]): Promise<any> {
        if (!this.db) {
            this.init();
        }

        let self = this;

        let p: Promise<any> = new Promise((resolve, reject) => {
            let error: any = null;
            let success = function (tableInfos: any) {
                self.db.transaction(function (tx) {
                    for (let c of cmds) {
                        switch (c.action) {
                            case Statement.DELETE: {
                                let wheres: string[] = ["(1=1)"];
                                let values: any[] = [];

                                let filters: string[] = [];
                                for (let i in c.filter) {
                                    wheres.push(`${i}=?`);
                                    values.push(c.filter[i]);
                                }

                                tx.executeSql(`DELETE FROM ${c.table} WHERE ${wheres.join(" AND ")}`, values);
                                break;
                            }
                            case Statement.INSERT: {
                                let exec = function (row) {
                                    let fields: string[] = [];
                                    let symbols: string[] = [];
                                    let values: any[] = [];

                                    for (let i in row) {
                                        if (tableInfos[c.table] && tableInfos[c.table].indexOf(i) > -1) {
                                            fields.push(i);
                                            symbols.push('?');
                                            values.push(row[i]);
                                        }
                                    }
                                    tx.executeSql(`INSERT INTO ${c.table} (${fields.join()}) VALUES (${symbols.join()})`, values);
                                };

                                if (c.data.length > 0) {
                                    for (let i of c.data) {
                                        exec(i);
                                    }
                                }
                                else {
                                    exec(c.data);
                                }
                                break;
                            }
                            case Statement.UPDATE: {
                                let fields: string[] = [];
                                let wheres: string[] = ["(1=1)"];
                                let values: any[] = [];

                                for (let i in c.data) {
                                    fields.push(`${i}=?`);
                                    values.push(c.data[i]);
                                }

                                let filters: string[] = [];
                                for (let i in c.filter) {
                                    wheres.push(`${i}=?`);
                                    values.push(c.filter[i]);
                                }

                                tx.executeSql(`UPDATE ${c.table} SET ${fields.join()} WHERE ${wheres.join(" AND ")}`, values);
                                break;
                            }
                        }
                    }
                }, reject, resolve);
            }

            let tableInfos: any = {};
            this.db.transaction(function (tx) {
                let tables: string[] = [];
                for (let i of cmds) {
                    if (!tables[i.table]) {
                        tables.push(i.table);
                    }
                }

                var getFields = function (index: number) {
                    if (index < tables.length) {
                        tx.executeSql(`SELECT field FROM _table_infos WHERE name=?`, [tables[index]],
                            function (t, r) {
                                let rows = self.toArray(r.rows);
                                let fields: string[] = [];
                                for (let i = 0; i < rows.length; i++) {
                                    fields.push(rows[i].field);
                                }
                                tableInfos[tables[index]] = fields;
                                getFields(index + 1);
                            });
                    }
                };
                getFields(0);
            }, reject, function () {
                success(tableInfos);
            });
        });
        return p;
    }
}