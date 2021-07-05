import { DatabaseService } from './../../services/database.service';
import { ProfileService } from './../../providers/profile.service';
import { Profiles } from './../../services/profile';
import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../providers/summary.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit {
  profiles: Profiles[] = [];

  profile = {};

  selectedView = 'profs';

  searchprofile = '';
  filtersex = 'Female/Male';

  constructor(
    private db: DatabaseService,
    private summaryService: SummaryService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.db.getDatabaseState().subscribe(async (rdy) => {
      if (rdy) {
        await this.profileService.loadProfiles();
        this.profileService.getProfs().subscribe((profs) => {
          this.profiles = profs;
        });
      }
    });
  }

  ionViewDidEnter() {}

  async getProfiles() {
    await this.profileService.loadProfiles(this.searchprofile, this.filtersex);
  }
}
