import { Component, OnInit } from '@angular/core';

import { DBService } from '../../services/db.service';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'app-developer',
    templateUrl: './developer.component.html',
    styleUrls: ['./developer.component.css']
})
export class DeveloperComponent implements OnInit {
    tableName: string;
    tableFields: string;
    result: string;
    sql: string;
    dataTable: any = {};
    
    constructor(private global: GlobalService, private db: DBService) { }

    ngOnInit() {
    }

    showAllTable(): void {
        this.sql = "SELECT tbl_name, sql from sqlite_master WHERE type = 'table'";
        this.showTableData();
    }

    showTableData(): void {
        this.dataTable.columns = [];
        this.dataTable.data = [];
        this.result = "";

        if (this.sql) {
            this.db.execCommand(this.sql).then(res => {
                var rows = res.rows;
                if (rows.length > 0) {
                    let columns: string[] = [];
                    for (let i in rows[0]) {
                        columns.push(i);
                    }
                    this.dataTable.columns = columns;
                    this.dataTable.data = rows;
                }
                this.result = `Total ${res.rows.length}, Affected ${res.affected}`;
            }).catch(res => {
                this.result = 'Error: ' + res.message;
            });
        }
        else {
            var fields = null;
            if (this.tableFields) {
                fields = this.tableFields.split(/\s*,\s*/);
            }

            this.db.find({
                fields: fields,
                table: this.tableName
            }).then(res => {
                this.result = `Total ${res.length}`;
                let columns: string[] = [];
                if (res.length > 0) {
                    for (let i in res[0]) {
                        columns.push(i);
                    }
                    this.dataTable.columns = columns;
                    this.dataTable.data = res;
                }
            }).catch(res => {
                alert(res.message);
            });
        }
    }
}