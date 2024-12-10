import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  utilities: {id: number, icon: string, firstLine: string, secondLine: string}[] | null = [
    {id: 1, icon: "door_back", firstLine: "Самостоятелно настаняване", secondLine: "Самостоятелно настаняване с цифров код"},
    {id: 2, icon: "pets", firstLine: "Приемат се космати приятели", secondLine: "Вземете и домашните си любимци по време на престоя си"},
    {id: 3, icon: "local_laundry_service", firstLine: "Пералня в жилището", secondLine: "Безплатно"},
    {id: 4, icon: "soap", firstLine: "Основни удобства", secondLine: "Кърпи, чаршафи, сапун и тоалетна хартия"},
    {id: 5, icon: "bed", firstLine: "Спано бельо", secondLine: "И допълнителни възглавници и одеяла"},
    {id: 6, icon: "iron", firstLine: "Ютия", secondLine: ""},
    {id: 7, icon: "connected_tv", firstLine: "Телевизори", secondLine: "Във всяка стая"},
    {id: 8, icon: "ac_unit", firstLine: "Климатик", secondLine: ""},
    {id: 9, icon: "device_thermostat", firstLine: "Отопление", secondLine: ""},
    {id: 10, icon: "security", firstLine: "Външни охранителни камери в собствеността", secondLine: "3 охранителни камери, наблюдаващи предния и задния изход, и гаража."},
    {id: 11, icon: "fire_extinguisher", firstLine: "Пожарогасител", secondLine: ""},
    {id: 12, icon: "wifi", firstLine: "Wi-Fi", secondLine: ""},
    {id: 13, icon: "local_dining", firstLine: "Кухня", secondLine: "Място, където гостите могат сами да приготвят храната си"},
    {id: 14, icon: "local_dining", firstLine: "Основни средства за готвене и хранене", secondLine: "Тенджери и тигани, олио, подправки, купи, клечки за хранене, чинии, чаши и др."},
    {id: 15, icon: "coffee_maker", firstLine: "Кафемашина", secondLine: ""},
    {id: 16, icon: "outdoor_grill", firstLine: "Барбекю", secondLine: "Скара, дървени въглища, бамбукови/метални шишове и др."},
    {id: 17, icon: "beach_access", firstLine: "Достъп до плажа – на първа линия", secondLine: "Гостите могат да ползват близкия плаж"},
    {id: 18, icon: "brunch_dining", firstLine: "Кът за хранене на открито", secondLine: ""},
    {id: 19, icon: "directions_car", firstLine: "Безплатен гараж за паркиране на място", secondLine: "2 места"},
    {id: 20, icon: "hot_tub", firstLine: "Самостоятелна хидромасажна вана", secondLine: "Предлага се целогодишно, отворено денонощно"},

    {id: 100, icon: "", firstLine: "", secondLine: ""},
  ]
}
