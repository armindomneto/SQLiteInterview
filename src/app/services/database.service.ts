import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: 'SampleSQLite.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.dumpDatabase();
        });
    });
  }

  dumpDatabase() {
    this.http
      .get('assets/dump.sql', { responseType: 'text' })
      .subscribe((sql) => {
        this.sqlitePorter
          .importSqlToDb(this.database, sql)
          .then((_) => {
            this.dbReady.next(true);
          })
          .catch((e) => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
}
