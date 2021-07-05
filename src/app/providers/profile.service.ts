import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profiles } from '../services/profile';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profiles = new BehaviorSubject([]);

  summary = {
    lowestAge: 150,
    highestAge: 0,
    average: 0,
  };

  constructor(private db: DatabaseService) {}

  getProfs(): Observable<Profiles[]> {
    return this.profiles.asObservable();
  }

  loadProfiles(search?, sex?) {
    let param = '%%';
    let SQL = 'SELECT * FROM profiles_db ';
    if (sex !== undefined && sex !== 'Female/Male' && sex !== '') {
      param = sex;
      SQL = SQL + ' WHERE sex = @0';
    } else {
      SQL = SQL + ' WHERE firstname LIKE @0';
      if (search !== undefined && search !== '') {
        param = '%' + search + '%';
      }
    }
    SQL = SQL + ' ORDER BY firstname';

    this.loadProfilesSummary(search, sex);
    return this.db.database.executeSql(SQL, [param]).then(async (data) => {
      const profiles: Profiles[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          profiles.push({
            id: data.rows.item(i).id,
            firstname: data.rows.item(i).firstname,
            lastname: data.rows.item(i).lastname,
            sex: data.rows.item(i).sex,
            birthday: data.rows.item(i).birthday,
          });
        }
      }
      this.profiles.next(profiles);
    });
  }

  loadProfilesSummary(search?, sex?) {
    let param = '%%';
    let SQL =
      'SELECT avg(Date() - birthday) as avgAge, min(Date() - birthday) as minAge, max(Date() - birthday) as maxAge FROM profiles_db ';
    if (sex !== undefined && sex !== 'Female/Male' && sex !== '') {
      param = sex;
      SQL = SQL + ' WHERE sex = @0';
    } else {
      SQL = SQL + ' WHERE firstname LIKE @0';
      if (search !== undefined && search !== '') {
        param = '%' + search + '%';
      }
    }

    return this.db.database.executeSql(SQL, [param]).then(async (data) => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.summary.lowestAge = data.rows.item(i).minAge;
          this.summary.highestAge = data.rows.item(i).maxAge;
          this.summary.average = data.rows.item(i).avgAge;
        }
      }
      localStorage.setItem('Summary', JSON.stringify(this.summary));
    });
  }

  addProfile(firstname, lastname, sex, birthday) {
    const data = [firstname, lastname, sex, birthday];
    return this.db.database
      .executeSql(
        'INSERT INTO profiles_db (firstname, lastname, sex, birthday) VALUES (?, ?, ?, ?)',
        data
      )
      .then(() => {
        this.loadProfiles();
      });
  }

  getProfileById(id): Promise<Profiles> {
    return this.db.database
      .executeSql('SELECT * FROM profiles_db WHERE id = ?', [id])
      .then((data) => ({
        id: data.rows.item(0).id,
        firstname: data.rows.item(0).firstname,
        lastname: data.rows.item(0).lastname,
        sex: data.rows.item(0).sex,
        birthday: data.rows.item(0).birthday,
      }));
  }

  deleteProfile(id) {
    return this.db.database
      .executeSql('DELETE FROM profiles_db WHERE id = ?', [id])
      .then((_) => {
        this.loadProfiles();
      });
  }

  updateProfile(prof: Profiles) {
    const data = [prof.firstname, prof.lastname, prof.sex, prof.birthday];
    return this.db.database
      .executeSql(
        `UPDATE profiles_db SET firstname = ?, lastname = ?, sex = ?, birthday = ? WHERE id = ${prof.id}`,
        data
      )
      .then(() => {
        this.loadProfiles();
      });
  }
}
