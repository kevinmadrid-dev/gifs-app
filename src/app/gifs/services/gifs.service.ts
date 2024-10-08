import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"

import { Gif, SearchResponse } from "../interfaces/gifs.interfaces"

@Injectable({
  providedIn: "root"
})
export class GifsService {
  gifList: Gif[] = []

  private itemHistory: string[] = []
  private serviceUrl: string = "https://api.giphy.com/v1/gifs"
  private apiKey: string = "GYMVrcfkmS39e01PZaG9oEMP87471FGv"

  constructor(private http: HttpClient) {
    this.loadLocalStorage()
  }

  get getItemHistory(): string[] {
    return [...this.itemHistory]
  }

  private oranizeHistory(item: string) {
    item = item.toLowerCase()

    if (this.itemHistory.includes(item)) {
      this.itemHistory = this.itemHistory.filter((oldItem) => oldItem !== item)
    }

    this.itemHistory.unshift(item)
    this.itemHistory = this.getItemHistory.splice(0, 10)
    this.saveLocalStorage()
  }

  private saveLocalStorage(): void {
    localStorage.setItem("history", JSON.stringify(this.itemHistory))
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem("history")) return
    this.itemHistory = JSON.parse(localStorage.getItem("history")!)

    if (this.itemHistory.length === 0) return
    this.searchItem(this.itemHistory[0])
  }

  searchItem(item: string): void {
    if (item.length === 0) return
    this.oranizeHistory(item)

    const params = new HttpParams()
      .set("api_key", this.apiKey)
      .set("limit", "20")
      .set("q", item)

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((response) => {
        this.gifList = response.data
      })
  }
}
