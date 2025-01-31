import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1; // Monday (0 = Sunday, 1 = Monday, etc.)
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const months = {
      long: [
        'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
        'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
      ],
      short: [
        'Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни',
        'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'
      ],
      narrow: ['Я', 'Ф', 'М', 'А', 'М', 'Ю', 'Ю', 'А', 'С', 'О', 'Н', 'Д']
    };

    return months[style] || months.long;
  }
}
