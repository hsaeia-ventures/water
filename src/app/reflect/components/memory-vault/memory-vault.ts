import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../../organize/services/organize.store';

@Component({
  selector: 'app-memory-vault',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (item of somedayItems(); track item.id) {
        <div class="relative group p-6 bg-zinc-900/40 border border-zinc-800/30 rounded-3xl hover:border-amber-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/5 cursor-default">
          <div class="flex flex-col gap-3">
            <span class="text-xs font-bold text-zinc-600 uppercase tracking-widest">{{ item.type === 'reference' ? 'Referencia' : 'Someday' }}</span>
            <h3 class="text-sm text-zinc-200 group-hover:text-amber-200/90 transition-colors">{{ item.title }}</h3>
            @if (item.notes) {
              <p class="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed font-light italic">"{{ item.notes }}"</p>
            }
          </div>
          
          <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button class="p-2 bg-zinc-800 rounded-full text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-90" title="Activar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
            <button class="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
          </div>
        </div>
      } @empty {
        <div class="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
          <p class="text-zinc-600 font-medium italic">Tu bóveda de recuerdos está vacía.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MemoryVaultComponent {
  private organizeStore = inject(OrganizeStore);
  public somedayItems = this.organizeStore.somedayItems;
}
