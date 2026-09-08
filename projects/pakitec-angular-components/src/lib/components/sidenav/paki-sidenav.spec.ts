import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PakiSidenav } from './paki-sidenav';

describe('PakiSidenav', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PakiSidenav],
      providers: [provideRouter([{ path: 'dashboard', component: PakiSidenav }])],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renderiza a estrutura de navegação lateral sem itens e sem erros', async () => {
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

  it('renderiza cada item com route como link navegável', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Configurações', route: '/settings' },
      { label: 'Ajuda', route: '/help' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.paki-sidenav__link');

    expect(links).toHaveLength(3);
    expect(links[0].textContent).toContain('Dashboard');
    expect(links[1].textContent).toContain('Configurações');
    expect(links[2].textContent).toContain('Ajuda');
  });

  it('aplica aria-current="page" no link da rota ativa', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Configurações', route: '/settings' },
    ]);
    fixture.detectChanges();

    await TestBed.inject(Router).navigateByUrl('/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.paki-sidenav__link');

    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[1].getAttribute('aria-current')).toBeNull();
  });
});
