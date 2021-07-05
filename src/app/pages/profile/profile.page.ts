import { ProfileService } from './../../providers/profile.service';
import { Profiles } from './../../services/profile';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profiles = {
    id: 0,
    firstname: '',
    lastname: '',
    sex: '',
    birthday: null,
  };

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id || id === '0') {
        return;
      }

      this.profileService.getProfileById(id).then((data) => {
        this.profile = data;
      });
    });
  }

  async addProfile() {
    if (this.validateProfile()) {
      this.profileService
        .addProfile(
          this.profile.firstname,
          this.profile.lastname,
          this.profile.sex,
          this.profile.birthday
        )
        .then((_) => {
          this.router.navigateByUrl('/');
        });
    } else {
      const toast = await this.toast.create({
        message: 'one or more fields need to be filled.',
        duration: 3000,
      });
      toast.present();
    }
  }

  delete() {
    this.profileService.deleteProfile(this.profile.id).then(() => {
      this.router.navigateByUrl('/');
    });
  }

  validateProfile() {
    if (this.profile.firstname === '' || this.profile.lastname === '') {
      return false;
    } else {
      if (this.profile.sex === '') {
        return false;
      } else {
        if (this.profile.birthday == null) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  async updateProfile() {
    if (this.validateProfile()) {
      this.profileService.updateProfile(this.profile).then(async (res) => {
        const toast = await this.toast.create({
          message: 'Profile updated',
          duration: 3000,
        });
        toast.present();
        this.router.navigateByUrl('/');
      });
    } else {
      const toast = await this.toast.create({
        message: 'one or more fields need to be filled.',
        duration: 3000,
      });
      toast.present();
    }
  }
}
