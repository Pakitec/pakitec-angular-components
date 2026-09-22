import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import {
  PakiNavigationRail,
  PakiNavigationRailBrand,
  PakiNavigationRailItem,
} from './paki-navigation-rail';

// Import via barrel de componentes (AC-011, FR-012, NFR-004). Usa namespace
// import para ler o símbolo em runtime sem erro de tipo por membro ausente. Se
// o barrel ainda não reexportar o componente, a leitura fica undefined e só o
// teste de export falha, sem quebrar a compilação de todo o spec.
import * as componentsBarrel from '../index';

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

/**
 * Cria o componente PakiNavigationRail direto (sem Host), com router mínimo.
 *
 * Serve aos testes de expansão e estado recolhido, que exercitam o próprio
 * componente por `setInput`/model e leem a variável CSS de largura no host.
 */
async function createRail(): Promise<
  ReturnType<typeof TestBed.createComponent<PakiNavigationRail>>
> {
  await TestBed.configureTestingModule({
    imports: [PakiNavigationRail],
    providers: [provideRouter([])],
  }).compileComponents();

  return TestBed.createComponent(PakiNavigationRail);
}

/**
 * Localiza o controle de expansão do rail.
 *
 * O controle é o `<button>` que expõe `aria-expanded` (FR-002). Distinguir dos
 * botões de item (sem rota), que não têm `aria-expanded`.
 */
function findExpansionControl(fixture: {
  nativeElement: HTMLElement;
}): HTMLButtonElement | null {
  return fixture.nativeElement.querySelector('button[aria-expanded]');
}

describe('PakiNavigationRail — expansão e estado recolhido', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('AC-001 — recolher e expandir', () => {
    it('inicia recolhido com --paki-navigation-rail-width = 64px', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      const width = getComputedStyle(host)
        .getPropertyValue('--paki-navigation-rail-width')
        .trim();

      expect(width).toBe('64px');
    });

    it('passa a --paki-navigation-rail-width = 216px ao expandir', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', []);
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      const width = getComputedStyle(host)
        .getPropertyValue('--paki-navigation-rail-width')
        .trim();

      expect(width).toBe('216px');
    });

    it('expõe o controle de expansão com aria-expanded refletindo o estado recolhido', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();
      await fixture.whenStable();

      const control = findExpansionControl(fixture);

      expect(control).toBeTruthy();
      expect(control!.getAttribute('aria-expanded')).toBe('false');
    });

    it('ao acionar o controle de expansão vai a 216px, emite expandedChange=true e expõe aria-expanded="true"', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', []);

      const expandedValues: boolean[] = [];
      fixture.componentInstance.expanded.subscribe((value) => expandedValues.push(value));

      fixture.detectChanges();
      await fixture.whenStable();

      const control = findExpansionControl(fixture);
      expect(control).toBeTruthy();

      control!.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      const width = getComputedStyle(host)
        .getPropertyValue('--paki-navigation-rail-width')
        .trim();

      expect(width).toBe('216px');
      expect(expandedValues).toEqual([true]);
      expect(control!.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('AC-007 — item recolhido só-ícone', () => {
    it('no estado recolhido o item expõe aria-label e title (tooltip) com o label', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', [
        { id: 'dash', label: 'Dashboard', icon: 'icon-dashboard' } as PakiNavigationRailItem,
      ]);
      fixture.componentRef.setInput('expanded', false);
      fixture.detectChanges();
      await fixture.whenStable();

      const control = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__link',
      ) as HTMLElement;

      expect(control).toBeTruthy();
      expect(control.getAttribute('aria-label')).toBe('Dashboard');
      expect(control.getAttribute('title')).toBe('Dashboard');
    });

    it('no estado recolhido o rótulo textual fica oculto para leitores, restando só o ícone', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', [
        { id: 'dash', label: 'Dashboard', icon: 'icon-dashboard' } as PakiNavigationRailItem,
      ]);
      fixture.componentRef.setInput('expanded', false);
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector('.paki-navigation-rail__icon') as HTMLElement;
      const host = fixture.nativeElement as HTMLElement;

      // Ícone permanece renderizado; o nome acessível vem de aria-label/title.
      expect(icon).toBeTruthy();
      // O host não deve carregar a classe de expansão no estado recolhido.
      expect(host.classList.contains('paki-navigation-rail--expanded')).toBe(false);
    });
  });

  describe('NFR-003 — reduced-motion', () => {
    it('o CSS aplicado ao componente declara a regra @media (prefers-reduced-motion: reduce)', async () => {
      // O runner é baseado em navegador; ler o SCSS por Node (fs) não funciona.
      // Renderizamos o componente e inspecionamos as folhas de estilo injetadas
      // no documento em busca da CSSMediaRule de reduced-motion. Assert de
      // presença da regra: o comportamento renderizado fica para o QA visual
      // (research R-E), pois o runner não simula a media query com confiança.
      const fixture = await createRail();
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();
      await fixture.whenStable();

      const hasReducedMotionRule = collectAppliedCssText().some((cssText) =>
        /@media[^{]*prefers-reduced-motion:\s*reduce/.test(cssText),
      );

      expect(hasReducedMotionRule).toBe(true);
    });
  });
});

/**
 * Host de teste para marca e rodapé do PakiNavigationRail.
 *
 * Fornece `items` e `brand` por binding para exercitar a separação do grupo
 * footer (AC-005) e o cabeçalho de marca navegável ou não (AC-006). Usa
 * provideRouter próprio para permitir navegação real pela rota da marca.
 */
@Component({
  imports: [PakiNavigationRail],
  template: `
    <paki-navigation-rail [items]="items" [brand]="brand"></paki-navigation-rail>
  `,
})
class BrandFooterHost {
  items: readonly PakiNavigationRailItem[] = [];
  brand: PakiNavigationRailBrand | undefined = undefined;
}

/** Cria o BrandFooterHost com router nas rotas usadas por itens e marca. */
async function createBrandFooterHost(): Promise<
  ReturnType<typeof TestBed.createComponent<BrandFooterHost>>
> {
  await TestBed.configureTestingModule({
    imports: [BrandFooterHost],
    providers: [
      provideRouter([
        { path: 'dashboard', component: PakiNavigationRail },
        { path: 'settings', component: PakiNavigationRail },
        { path: 'home', component: PakiNavigationRail },
      ]),
    ],
  }).compileComponents();

  return TestBed.createComponent(BrandFooterHost);
}

describe('PakiNavigationRail — rodapé e marca', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('AC-005 — item de rodapé ancorado e separado', () => {
    it('renderiza o item footer em um container distinto do container dos itens main', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [
        { id: 'dash', label: 'Dashboard', route: '/dashboard', position: 'main' },
        { id: 'cfg', label: 'Configurações', route: '/settings', position: 'footer' },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const mainContainer = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__list--main',
      ) as HTMLElement;
      const footerContainer = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__list--footer',
      ) as HTMLElement;

      // Cada grupo tem seu próprio container; footer é distinto do main.
      expect(mainContainer).toBeTruthy();
      expect(footerContainer).toBeTruthy();
      expect(footerContainer).not.toBe(mainContainer);

      // O item footer vive no container footer, não no container main.
      const footerLink = footerContainer.querySelector('a[href="/settings"]');
      expect(footerLink).toBeTruthy();
      expect(mainContainer.querySelector('a[href="/settings"]')).toBeNull();

      // O item main vive no container main, não no container footer.
      const mainLink = mainContainer.querySelector('a[href="/dashboard"]');
      expect(mainLink).toBeTruthy();
      expect(footerContainer.querySelector('a[href="/dashboard"]')).toBeNull();
    });

    it('trata item sem position como main, fora do container de rodapé', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [
        { id: 'home', label: 'Início', route: '/home' },
        { id: 'cfg', label: 'Configurações', route: '/settings', position: 'footer' },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const mainContainer = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__list--main',
      ) as HTMLElement;
      const footerContainer = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__list--footer',
      ) as HTMLElement;

      // Item sem position renderiza no grupo main.
      expect(mainContainer.querySelector('a[href="/home"]')).toBeTruthy();
      expect(footerContainer.querySelector('a[href="/home"]')).toBeNull();
    });

    it('ancora o grupo de rodapé ao pé do rail com margin-top:auto', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [
        { id: 'cfg', label: 'Configurações', route: '/settings', position: 'footer' },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const footerContainer = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__list--footer',
      ) as HTMLElement;

      expect(footerContainer).toBeTruthy();
      // A âncora ao rodapé usa margin-top:auto (o divisor visual fica no QA).
      expect(getComputedStyle(footerContainer).marginTop).toBe('auto');
    });
  });

  describe('AC-006 — cabeçalho de marca', () => {
    it('exibe o label da marca no cabeçalho', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [];
      fixture.componentInstance.brand = { label: 'Pakitec' };
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__brand',
      ) as HTMLElement;

      expect(header).toBeTruthy();
      expect(header.textContent).toContain('Pakitec');
    });

    it('renderiza o cabeçalho como <a routerLink> quando há brand.route', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [];
      fixture.componentInstance.brand = { label: 'Pakitec', route: '/home' };
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__brand',
      ) as HTMLElement;
      const link = header.querySelector('a[href="/home"]') as HTMLAnchorElement | null;

      expect(link).toBeTruthy();
      expect(link!.textContent).toContain('Pakitec');
    });

    it('navega ao acionar o cabeçalho de marca com brand.route', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [];
      fixture.componentInstance.brand = { label: 'Pakitec', route: '/home' };
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const router = TestBed.inject(Router);
      const header = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__brand',
      ) as HTMLElement;
      const link = header.querySelector('a[href="/home"]') as HTMLAnchorElement;

      link.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(router.url).toBe('/home');
    });

    it('renderiza o cabeçalho não navegável (sem <a>) quando falta brand.route', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [];
      fixture.componentInstance.brand = { label: 'Pakitec' };
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__brand',
      ) as HTMLElement;

      expect(header).toBeTruthy();
      // Sem route, o cabeçalho é elemento não interativo: nenhum <a> presente.
      expect(header.querySelector('a')).toBeNull();
    });
  });
});

describe('PakiNavigationRail — robustez de dados parciais', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('AC-008 (FR-009) — lista vazia com marca', () => {
    it('renderiza sem lançar quando items é vazio e mantém o cabeçalho de marca', async () => {
      const fixture = await createBrandFooterHost();
      fixture.componentInstance.items = [];
      fixture.componentInstance.brand = { label: 'Pakitec' };

      // O rail deve montar mesmo sem itens; a marca não depende da lista.
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
      await fixture.whenStable();
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__brand',
      ) as HTMLElement;

      // Com items vazio, o cabeçalho de marca ainda aparece com o label.
      expect(header).toBeTruthy();
      expect(header.textContent).toContain('Pakitec');

      // Sem itens, nenhum controle de link é renderizado nas listas.
      const links = fixture.nativeElement.querySelectorAll(
        '.paki-navigation-rail__link',
      );
      expect(links.length).toBe(0);
    });
  });

  describe('AC-009 (FR-010) — item sem ícone', () => {
    it('renderiza o item sem o span de ícone e mantém o label como nome acessível', async () => {
      const fixture = await createRail();
      fixture.componentRef.setInput('items', [
        { id: 'action', label: 'Ação' } as PakiNavigationRailItem,
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const control = fixture.nativeElement.querySelector(
        '.paki-navigation-rail__link',
      ) as HTMLElement;

      // O item existe mesmo sem ícone declarado.
      expect(control).toBeTruthy();

      // Sem icon, o span de ícone não deve ser renderizado.
      const icon = control.querySelector('.paki-navigation-rail__icon');
      expect(icon).toBeNull();

      // O label segue como nome acessível (aria-label) do controle.
      expect(control.getAttribute('aria-label')).toBe('Ação');
    });
  });
});

describe('PakiNavigationRail — acessibilidade de foco (AC-010)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // AC-010 (FR-011, NFR-001): o foco por teclado precisa ser visível. Assere a
  // presença de uma regra :focus-visible com outline no escopo do componente,
  // no mesmo estilo do teste de reduced-motion que concatena as regras CSS
  // aplicadas. O comportamento visual fica para o QA; aqui basta a regra existir.
  it('o CSS aplicado ao componente declara regra :focus-visible com outline', async () => {
    const fixture = await createRail();
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    await fixture.whenStable();

    const hasFocusVisibleOutline = collectAppliedCssText().some(
      (cssText) => /:focus-visible/.test(cssText) && /outline/.test(cssText),
    );

    expect(hasFocusVisibleOutline).toBe(true);
  });
});

describe('PakiNavigationRail — export via barrel (AC-011)', () => {
  // AC-011 (FR-012, NFR-004): o componente é consumível por quem importa o
  // barrel de componentes da biblioteca. Assere que o símbolo reexportado está
  // definido e é a mesma classe do módulo direto.
  it('reexporta PakiNavigationRail pelo barrel de componentes', () => {
    const exported = (componentsBarrel as Record<string, unknown>)['PakiNavigationRail'];

    expect(exported).toBeDefined();
    expect(exported).toBe(PakiNavigationRail);
  });
});

/**
 * Concatena o texto de todas as regras CSS acessíveis do documento.
 *
 * Inclui `document.styleSheets` e `document.adoptedStyleSheets`, onde o Angular
 * injeta os estilos de componente no ambiente de teste. Ignora folhas
 * cross-origin que lançam `SecurityError` ao acessar `cssRules`.
 *
 * @returns Lista com o `cssText` de cada regra encontrada.
 */
function collectAppliedCssText(): string[] {
  const texts: string[] = [];

  const readRules = (sheet: CSSStyleSheet): void => {
    let rules: CSSRuleList | undefined;
    try {
      rules = sheet.cssRules;
    } catch {
      return;
    }
    for (const rule of Array.from(rules)) {
      texts.push(rule.cssText);
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    readRules(sheet as CSSStyleSheet);
  }
  for (const sheet of Array.from(document.adoptedStyleSheets ?? [])) {
    readRules(sheet);
  }

  return texts;
}
