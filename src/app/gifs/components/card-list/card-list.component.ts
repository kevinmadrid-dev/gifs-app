import { Component, computed } from "@angular/core"

import { Gif } from "../../interfaces/gifs.interfaces"
import { GifsService } from "../../services/gifs.service"

@Component({
  selector: "gifs-card-list",
  templateUrl: "./card-list.component.html"
})
export class CardListComponent {
  constructor(private gifsService: GifsService) {}

  // Computed signals para acceder a los datos del servicio
  public gifList = computed(() => this.gifsService.gifList())
  public isLoading = computed(() => this.gifsService.isLoading())
  public error = computed(() => this.gifsService.error())
}
