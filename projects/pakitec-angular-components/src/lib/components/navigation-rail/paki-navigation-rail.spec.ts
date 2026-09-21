import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PakiNavigationRail, PakiNavigationRailItem } from './paki-navigation-rail';

/**
 * Host de teste do PakiNavigationRail.
 *
 * Fornece `items` por binding e acumula os ids emitidos por `itemSelected`.
 * O padrão segue `paki-sidenav.spec.ts`: Host component + provideRouter para
 * exercitar navegação real via RouterLink e destaque de rota ativa.
 */
@Component({
  imports: [PakiNavigationRail],
  template: `
    <paki-navigation-rail
      [items]="items"
      (itemSelected)="onItemSelected($event)"
    ></paki-navigation-rail>
  `,
})
class Host {
  items: readonly PakiNavigationRailItem[] = [];
  selectedIds: string[] = [];

  onItemSelected(id: string): void {
    this.selectedIds.push(id);
  }
}

/** Cria o Host com router configurado nas rotas usadas pelos itens de teste. */
async function createHost(): Promise<ReturnType<typeof TestBed.createComponent<Host>>> {
  await TestBed.configureTestingModule({
    imports: [Host],
    providers: [
      provideRouter([
        { path: 'dashboard', component: PakiNavigationRail },
        { path: 'reports', component: PakiNavigationRail },
      ]),
    ],
  }).compileComponents();

  return TestBed.createComponent(Host);
}

describe('PakiNavigationRail — navegação por item', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('AC-002 — item com rota', () => {
    it('renderiza <a> com routerLink para o item com rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [{ id: 'dash', label: 'Dashboard', route: '/dashboard' }];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a[href="/dashboard"]') as HTMLAnchorElement;

      expect(link).toBeTruthy();
      expect(link.textContent).toContain('Dashboard');
    });

    it('aplica classe active e aria-current="page" após navegar para a rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [
        { id: 'dash', label: 'Dashboard', route: '/dashboard' },
        { id: 'rep', label: 'Relatórios', route: '/reports' },
      ];
      fixture.detectChanges();

      await TestBed.inject(Router).navigateByUrl('/dashboard');
      await fixture.whenStable();
      fixture.detectChanges();

      const active = fixture.nativeElement.querySelector('a[href="/dashboard"]') as HTMLAnchorElement;
      const inactive = fixture.nativeElement.querySelector('a[href="/reports"]') as HTMLAnchorElement;

      expect(active.classList.contains('active')).toBe(true);
      expect(active.getAttribute('aria-current')).toBe('page');
      expect(inactive.getAttribute('aria-current')).toBeNull();
    });

    it('emite itemSelected com o id ao acionar o item com rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [{ id: 'dash', label: 'Dashboard', route: '/dashboard' }];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a[href="/dashboard"]') as HTMLAnchorElement;
      link.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.selectedIds).toEqual(['dash']);
    });
  });

  describe('AC-003 — item sem rota', () => {
    it('renderiza <button> e nenhum <a> para o item sem rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [{ id: 'action', label: 'Ação' }];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      const anchor = fixture.nativeElement.querySelector('a');

      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Ação');
      expect(anchor).toBeNull();
    });

    it('emite apenas itemSelected com o id, sem navegar, ao acionar o item sem rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [{ id: 'action', label: 'Ação' }];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const router = TestBed.inject(Router);
      const urlBefore = router.url;

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.selectedIds).toEqual(['action']);
      expect(router.url).toBe(urlBefore);
    });
  });

  describe('AC-004 — item disabled', () => {
    it('expõe aria-disabled="true" no item disabled', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [
        { id: 'off', label: 'Indisponível', route: '/dashboard', disabled: true },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const control = fixture.nativeElement.querySelector('[aria-disabled="true"]') as HTMLElement;

      expect(control).toBeTruthy();
      expect(control.textContent).toContain('Indisponível');
    });

    it('não renderiza <a> navegável para o item disabled com rota', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [
        { id: 'off', label: 'Indisponível', route: '/dashboard', disabled: true },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const navigableLink = fixture.nativeElement.querySelector('a[href="/dashboard"]');

      expect(navigableLink).toBeNull();
    });

    it('não navega e não emite itemSelected ao acionar o item disabled', async () => {
      const fixture = await createHost();
      fixture.componentInstance.items = [
        { id: 'off', label: 'Indisponível', route: '/dashboard', disabled: true },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const router = TestBed.inject(Router);
      const urlBefore = router.url;

      const control = fixture.nativeElement.querySelector('[aria-disabled="true"]') as HTMLElement;
      control.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.selectedIds).toEqual([]);
      expect(router.url).toBe(urlBefore);
    });
  });
});
