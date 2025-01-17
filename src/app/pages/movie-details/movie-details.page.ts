import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  protected movie: any = null;
  protected page: number = 1;
  protected similarMovies: any[] = [];
  protected nextFiveSimilarMovies: any[] = []; //NEW THING
  protected imageBaseUrl = environment.images;
  protected showSimilarMovies = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private loadingCtrl: LoadingController//NEW THING
  ) {}

  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.movieService.getMovieDetails(id).subscribe((res) => {
      console.log(res);
      console.log("current selected movie details^^");
      this.movie = res;
    });
  }

  openHomepage() {
    window.open(this.movie.homepage);
  }

  toggleSimilarMovies() {
    this.showSimilarMovies = !this.showSimilarMovies;
    this.getSimilarMovies();//NEW THING
  }

  getRoute(id: string) {
    return `../${id} `;
  }

  async getSimilarMovies() {//NEW THING HERE TO END
    console.warn('getNextFiveSimilarMovies()');
    if (this.similarMovies.length == 0) {
      const loading = await this.loadingCtrl.create({
        message: 'Caters Fast Five!...',
        spinner: 'lines',
      });
      await loading.present();

      this.page++;
      this.movieService
        .getSimilarMovies(this.movie.id, this.page)
        .subscribe((res) => {
          loading.dismiss();
          this.similarMovies = res.results;

          console.table(this.similarMovies);

          this.nextFiveSimilarMovies = this.similarMovies.splice(0, 5);

          console.table(this.nextFiveSimilarMovies);
        });
    }
  }

  getFiveSimilarMovies() {
    console.warn('getFiveSimilarMovies()');

    this.getSimilarMovies();
    this.nextFiveSimilarMovies = this.similarMovies.splice(0, 5);
    console.table(this.nextFiveSimilarMovies);
  }
}
