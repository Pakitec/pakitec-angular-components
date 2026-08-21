import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PakiModuleTabs } from './paki-module-tabs';

describe('PakiModuleTabs', () => {
  it('renders accessible links and marks the current route', async () => {
    await TestBed.configureTestingModule({
      imports: [PakiModuleTabs],
      providers: [provideRouter([{ path: 'products', component: PakiModuleTabs }])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PakiModuleTabs);
    fixture.componentRef.setInput('label', 'Navegação de estoque');
    fixture.componentRef.setInput('tabs', [
      { label: 'Produtos', route: '/products' },
      { label: 'Saldos e lotes', route: '/inventory' },
    ]);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/products');
    await fixture.whenStable();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const links = nav.querySelectorAll('a');
    expect(nav.getAttribute('aria-label')).toBe('Navegação de estoque');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('aria-current')).toBe('page');
  });
});
