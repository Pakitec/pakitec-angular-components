import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PakiSidenav } from './paki-sidenav';

describe('PakiSidenav', () => {
  it('renderiza a estrutura de navegação lateral sem itens e sem erros', async () => {
    await TestBed.configureTestingModule({
      imports: [PakiSidenav],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const list = nav.querySelector('ul') as HTMLElement;

    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Navegação principal');
    expect(list).toBeTruthy();
    expect(list.querySelectorAll('li')).toHaveLength(0);
  });
});
