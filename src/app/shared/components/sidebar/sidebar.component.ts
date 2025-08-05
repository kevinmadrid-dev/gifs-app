import { Component, computed } from "@angular/core"

import { GifsService } from "../../../gifs/services/gifs.service"

@Component({
  selector: "shared-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css"
})
export class SidebarComponent {
  constructor(private gifsService: GifsService) {}

  // Usando computed signals para mejor reactividad
  public itemHistory = computed(() => this.gifsService.itemHistory())
  public hasHistory = computed(() => this.gifsService.hasHistory())

  reSearch(item: string): void {
    this.gifsService.searchItem(item)
  }

  removeFromHistory(item: string): void {
    this.gifsService.removeFromHistory(item)
  }

  clearHistory(): void {
    this.gifsService.clearHistory()
  }

  loadTrending(): void {
    this.gifsService.getTrendingGifs()
  }
}
