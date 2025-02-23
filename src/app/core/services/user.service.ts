import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Repository } from 'src/app/shared/models/repo';
import { user } from 'src/app/shared/models/user';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly API = environment.API;

  public totalStars: number = 0;
  public user: user = {
    login: '',
  };
  public repositories: Repository[] = [];
  public onEnterBoolean: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  reset() {
    this.totalStars = 0;
    this.user = {
      login: '',
    };
    this.repositories = [];
    this.onEnterBoolean = false;
  }

  getUser(name: string) {
    return this.http
      .get<user>(`${this.API}users/${name}`)
      .pipe(take(1))
  }

  getRepos(name: string) {
    return this.http
      .get<Repository[]>(
        `${this.API}users/${name}/repos`
      )
      .pipe(take(1));
  }

  getStars(name: string) {
    this.getRepos(name).subscribe((data: Repository[]) => {
      data.forEach((Repository) => {
        this.totalStars = Repository.stargazers_count + this.totalStars;
      });
    });
  }

  existUser() {
    return this.user.login != '' ? true : false;
  }

  existRepository() {
    return this.repositories[0].owner.login != '' ? true : false;
  }

  onEnter() {
    this.onEnterBoolean = !this.onEnterBoolean;
    return this.onEnterBoolean;
  }
}
