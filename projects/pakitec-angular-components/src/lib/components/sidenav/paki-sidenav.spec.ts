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

  it('renderiza grupo com botão de expansão e alterna visibilidade dos filhos', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Módulos',
        children: [
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Relatórios', route: '/reports' },
        ],
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.paki-sidenav__group-header') as HTMLButtonElement;
    const childList = fixture.nativeElement.querySelector('ul.paki-sidenav__group-children') as HTMLElement;

    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('paki-sidenav-group-0-children');
    expect(childList).toBeTruthy();
    expect(childList.id).toBe('paki-sidenav-group-0-children');
    expect(childList.querySelectorAll('a.paki-sidenav__link')).toHaveLength(2);

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('respeita o estado inicial expanded de um grupo', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Módulos',
        expanded: true,
        children: [{ label: 'Dashboard', route: '/dashboard' }],
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button.paki-sidenav__group-header') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('alterna a visibilidade dos filhos ao clicar no cabeçalho do grupo', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Módulos',
        children: [
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Relatórios', route: '/reports' },
        ],
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.paki-sidenav__group-header') as HTMLButtonElement;

    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('true');

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('mantém grupos independentes entre si', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Módulos',
        children: [{ label: 'Dashboard', route: '/dashboard' }],
      },
      {
        label: 'Configurações',
        children: [{ label: 'Geral', route: '/settings/general' }],
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.paki-sidenav__group-header') as NodeListOf<HTMLButtonElement>;

    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');

    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
  });

  it('trata grupo sem filhos como item simples', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      { label: 'Dashboard', route: '/dashboard', children: [] },
      { label: 'Ajuda', children: [] },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.paki-sidenav__group-header');
    const links = fixture.nativeElement.querySelectorAll('a.paki-sidenav__link');
    const texts = fixture.nativeElement.querySelectorAll('span.paki-sidenav__text');

    expect(buttons).toHaveLength(0);
    expect(links).toHaveLength(1);
    expect(texts).toHaveLength(1);
    expect(links[0].textContent).toContain('Dashboard');
    expect(texts[0].textContent).toContain('Ajuda');
  });

  it('ignora netos além de um nível de profundidade', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Configurações',
        children: [
          {
            label: 'Geral',
            children: [{ label: 'Avançado', route: '/advanced' }],
          },
        ],
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const groupChildren = fixture.nativeElement.querySelector('ul.paki-sidenav__group-children') as HTMLElement;
    expect(groupChildren.querySelectorAll('li')).toHaveLength(1);
    expect(groupChildren.querySelectorAll('a.paki-sidenav__link')).toHaveLength(0);
    expect(groupChildren.textContent).toContain('Geral');
  });

  it('mantém estado do grupo independente da largura do sidenav', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', [
      {
        label: 'Módulos',
        expanded: true,
        children: [{ label: 'Dashboard', route: '/dashboard' }],
      },
    ]);
    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button.paki-sidenav__group-header') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('emite toggle, opened e closed quando o estado expandido muda', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', []);

    const toggleValues: boolean[] = [];
    let openedCount = 0;
    let closedCount = 0;

    fixture.componentInstance.toggle.subscribe((value) => toggleValues.push(value));
    fixture.componentInstance.opened.subscribe(() => openedCount++);
    fixture.componentInstance.closed.subscribe(() => closedCount++);

    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggleValues).toEqual([true]);
    expect(openedCount).toBe(1);
    expect(closedCount).toBe(0);

    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggleValues).toEqual([true, false]);
    expect(openedCount).toBe(1);
    expect(closedCount).toBe(1);
  });

  it('aplica classe de largura expandida e colapsada no host', async () => {
    const fixture = TestBed.createComponent(PakiSidenav);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.classList.contains('paki-sidenav--expanded')).toBe(false);

    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.classList.contains('paki-sidenav--expanded')).toBe(true);
  });
});
