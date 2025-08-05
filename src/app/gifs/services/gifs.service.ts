import { Injectable, signal, computed } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { catchError, of } from "rxjs"

import { Gif, SearchResponse } from "../interfaces/gifs.interfaces"

@Injectable({
  providedIn: "root"
})
export class GifsService {
  // Signals para mejor reactividad
  private _gifList = signal<Gif[]>([])
  private _itemHistory = signal<string[]>([])
  private _isLoading = signal<boolean>(false)
  private _error = signal<string | null>(null)

  // Computed signals para exponer los datos
  public gifList = this._gifList.asReadonly()
  public itemHistory = this._itemHistory.asReadonly()
  public isLoading = this._isLoading.asReadonly()
  public error = this._error.asReadonly()

  // Computed para verificar si hay historial
  public hasHistory = computed(() => this._itemHistory().length > 0)

  private readonly serviceUrl: string = "https://api.giphy.com/v1/gifs"
  private readonly apiKey: string = "GYMVrcfkmS39e01PZaG9oEMP87471FGv"
  private readonly maxHistoryItems: number = 10

  constructor(private http: HttpClient) {
    this.loadLocalStorage()
  }

  private organizeHistory(item: string): void {
    item = item.toLowerCase()
    const currentHistory = this._itemHistory()

    // Filtrar el item si ya existe
    let newHistory = currentHistory.filter((oldItem) => oldItem !== item)

    // Agregar al inicio
    newHistory.unshift(item)

    // Limitar a maxHistoryItems
    newHistory = newHistory.slice(0, this.maxHistoryItems)

    this._itemHistory.set(newHistory)
    this.saveLocalStorage()
  }

  private saveLocalStorage(): void {
    localStorage.setItem("history", JSON.stringify(this._itemHistory()))
  }

  private loadLocalStorage(): void {
    const stored = localStorage.getItem("history")
    if (!stored) return

    const history = JSON.parse(stored) as string[]
    this._itemHistory.set(history)

    if (history.length > 0) {
      this.searchItem(history[0])
    }
  }

  // Nuevos métodos para gestionar el historial
  removeFromHistory(item: string): void {
    const currentHistory = this._itemHistory()
    const newHistory = currentHistory.filter((historyItem) => historyItem !== item)
    this._itemHistory.set(newHistory)
    this.saveLocalStorage()
  }

  clearHistory(): void {
    this._itemHistory.set([])
    this.saveLocalStorage()
  }

  searchItem(item: string): void {
    if (item.length === 0) return

    this._isLoading.set(true)
    this._error.set(null)
    this.organizeHistory(item)

    const params = new HttpParams()
      .set("api_key", this.apiKey)
      .set("limit", "20")
      .set("q", item)

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .pipe(
        catchError((error) => {
          console.error("Error searching GIFs:", error)
          this._error.set("Error al buscar GIFs. Por favor, intenta de nuevo.")
          return of({
            data: [],
            meta: {} as any,
            pagination: {} as any
          } as SearchResponse)
        })
      )
      .subscribe((response) => {
        this._gifList.set(response.data)
        this._isLoading.set(false)
      })
  }

  // Nuevo método para obtener GIFs trending
  getTrendingGifs(): void {
    this._isLoading.set(true)
    this._error.set(null)

    const params = new HttpParams().set("api_key", this.apiKey).set("limit", "20")

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/trending`, { params })
      .pipe(
        catchError((error) => {
          console.error("Error fetching trending GIFs:", error)
          this._error.set(
            "Error al cargar GIFs populares. Por favor, intenta de nuevo."
          )
          return of({
            data: [],
            meta: {} as any,
            pagination: {} as any
          } as SearchResponse)
        })
      )
      .subscribe((response) => {
        this._gifList.set(response.data)
        this._isLoading.set(false)
      })
  }
}
