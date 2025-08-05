import { Component } from "@angular/core"

@Component({
  selector: "gifs-home-page",
  templateUrl: "./home-page.component.html"
})
export class HomePageComponent {
  // Ya no necesitamos inyectar el servicio aquí
  // Los componentes hijos manejan sus propios signals
}
