import { Component, ElementRef, ViewChild, computed } from "@angular/core"

import { GifsService } from "../../services/gifs.service"

@Component({
  selector: "gifs-search-box",
  templateUrl: "./search-box.component.html"
})
export class SearchBoxComponent {
  constructor(private gifsService: GifsService) {}

  @ViewChild("txtSearchInput")
  tagInput!: ElementRef<HTMLInputElement>

  // Computed para acceder al estado de carga
  public isLoading = computed(() => this.gifsService.isLoading())

  searchItem(): void {
    const item = this.tagInput.nativeElement.value.trim()

    if (item.length === 0) return

    this.gifsService.searchItem(item)
    this.tagInput.nativeElement.value = ""
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.searchItem()
    }
  }
}
