import { Component, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PricesType } from '../prices.model';
import { HttpClient } from '@angular/common/http';
import { PeriodsType } from '../periods.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIcon, RouterModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(private http: HttpClient, private destroyRef: DestroyRef){}

  prices: PricesType | null = null
  periods: PeriodsType | null = null
  
  utilities: {id: number, icon: string, firstLine: string, secondLine: string}[] = [
    {id: 1, icon: "login", firstLine: "Настаняване", secondLine: "От 15:00 ч. до 0:00 ч. (Информирайте ни предварително кога пристигате)"},
    {id: 2, icon: "logout", firstLine: "Напускане", secondLine: "От 8:00 ч. до 12:00 ч."},
    {id: 3, icon: "door_back", firstLine: "Самостоятелно настаняване", secondLine: "Самостоятелно настаняване с цифров код"},
    {id: 4, icon: "pets", firstLine: "Приемат се космати приятели", secondLine: "Вземете и домашните си любимци по време на престоя си"},
    {id: 5, icon: "local_laundry_service", firstLine: "Пералня в жилището", secondLine: "Безплатно"},
    {id: 6, icon: "soap", firstLine: "Основни удобства", secondLine: "Кърпи, чаршафи, сапун и тоалетна хартия"},
    {id: 7, icon: "bed", firstLine: "Спано бельо", secondLine: "И допълнителни възглавници и одеяла"},
    {id: 8, icon: "iron", firstLine: "Ютия", secondLine: ""},
    {id: 9, icon: "connected_tv", firstLine: "Телевизори", secondLine: "Във всяка стая"},
    {id: 10, icon: "ac_unit", firstLine: "Климатик", secondLine: ""},
    {id: 11, icon: "device_thermostat", firstLine: "Отопление", secondLine: ""},
    {id: 12, icon: "security", firstLine: "Външни охранителни камери в собствеността", secondLine: "3 охранителни камери, наблюдаващи предния и задния изход, и гаража."},
    {id: 13, icon: "fire_extinguisher", firstLine: "Пожарогасител", secondLine: ""},
    {id: 14, icon: "wifi", firstLine: "Wi-Fi", secondLine: ""},
    {id: 15, icon: "local_dining", firstLine: "Кухня", secondLine: "Място, където гостите могат сами да приготвят храната си"},
    {id: 16, icon: "local_dining", firstLine: "Основни средства за готвене и хранене", secondLine: "Тенджери и тигани, олио, подправки, купи, клечки за хранене, чинии, чаши и др."},
    {id: 17, icon: "coffee_maker", firstLine: "Кафемашина", secondLine: ""},
    {id: 18, icon: "outdoor_grill", firstLine: "Барбекю", secondLine: "Скара, дървени въглища, бамбукови/метални шишове и др."},
    {id: 19, icon: "beach_access", firstLine: "Достъп до плажа – на първа линия", secondLine: "Гостите могат да ползват близкия плаж"},
    {id: 20, icon: "brunch_dining", firstLine: "Кът за хранене на открито", secondLine: ""},
    {id: 21, icon: "directions_car", firstLine: "Безплатен гараж за паркиране на място", secondLine: "2 места"},
    {id: 22, icon: "hot_tub", firstLine: "Самостоятелна хидромасажна вана", secondLine: "Предлага се целогодишно, отворено денонощно"},

    // {id: 100, icon: "", firstLine: "", secondLine: ""},
  ]

  reviews: {id: number, stars: number, name: string, text: string, platform: string, month_year: string}[] = [
    {id: 1, stars: 5, name: "Силвия", text: "Имаше абсолютно всичко необходимо и в кухнята, и в баните, и в спалните . Изключително мили и ненатрапчиви домакини, благодарности за тях. Всяко наше изискване и желание беше посрещано с изключителна отзивчивост и навременна и адекватна реакция. Изключително чисто, подредено, с внимание към всеки детайл. Обстановката е дори по-чаровна от представените снимки, леглата са удобни и големи. Двата градски плажа са на пешеходно разстояние (7-8мин. с малки деца.), центъра на градчето (пешеходната зона) е буквално на минута разстояние, а паркът е отсреща. Джакузито е блестящо от чистота и предлага нотка и на спа преживяване. Със сигурност бихме се върнали, ако решим да почиваме отново в Царево.", platform: "AirBnb", month_year: "Юли 2024"},
    {id: 2, stars: 5, name: "Георги", text: "Изключително любезни домакини. Къщата е много добре направена и има всичко необходимо за малки и големи. Има гараж, който побра 5 метра автомобил и допълнително паркомясто. Близо да главната улица, морската градина и детски парк, както и до централния плаж. Нови електроуреди или поне бяха толкова чисти, че изглеждаха като нови.", platform: "Booking", month_year: "Юли 2024"},
    {id: 3, stars: 5, name: "Bachoto", text: "Всичко беше чисто и удобно. Къщата е напълно обзаведена с всички необходими неща и провизии. Кухнята е чиста и има разнообразие от кухненски уреди и продукти, които да използвате. Дори дойде с леки закуски за добре дошли. Вътре къщата беше чиста и подредена, с климатик, който работеше перфектно. Баните са просторни и имат прозорци, които осигуряват вентилация. Горе, джакузито е добре поддържано, а таблетките и мрежата са оставени, за да почистите, за да поддържате чистотата по време на престоя си. Барбекюто/външната кухня беше лесна за използване и имаше добро осветление. Собствениците винаги поддържаха връзка и поддържаха контакт, отговаряйки на въпросите или запитванията, които имахме. Като цяло, беше прекрасно преживяване и с удоволствие бих го направил отново.", platform: "Booking", month_year: "Август 2024"},

    // {id: 100, stars: 5, name: "", text: "", platform: "", month_year: ""},
  ]

  stars(stars: number) {
    return new Array(stars)
  }

  private fetchPrices () {
    return this.http.get<PricesType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/prices.json')
  }

  private fetchPeriods () {
    return this.http.get<PeriodsType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/periods.json')
  }

  ngOnInit() {
    const pricesSubscription = this.fetchPrices().subscribe({
      next: (data) => {
        this.prices = data
      },
      error: (err) => console.log(err)
    })

    const periodsSubscription = this.fetchPeriods().subscribe({
      next: (data) => {
        this.periods = data
      }
    })

    this.destroyRef.onDestroy(() => {
      pricesSubscription.unsubscribe()
      periodsSubscription.unsubscribe()
    })
  }
}
