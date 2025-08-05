import { Component, Input, OnInit, signal } from "@angular/core"

@Component({
  selector: "shared-lazy-image",
  templateUrl: "./lazy-image.component.html"
})
export class LazyImageComponent implements OnInit {
  ngOnInit(): void {
    if (!this.url) throw new Error("URL property is required")
  }

  @Input()
  url!: string

  @Input()
  alt: string = ""

  // Signal para controlar el estado de carga
  private _hasLoaded = signal<boolean>(false)
  public hasLoaded = this._hasLoaded.asReadonly()

  onLoad(): void {
    // Pequeño delay para mostrar la transición suave
    setTimeout(() => {
      this._hasLoaded.set(true)
    }, 100)
  }

  onError(): void {
    console.warn(`Error loading image: ${this.url}`)
  }
}
