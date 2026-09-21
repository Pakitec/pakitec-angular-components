import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Item de navegação do rail.
 *
 * O consumidor fornece a lista completa; o componente apenas renderiza e emite.
 * A ausência de `position` é tratada como `main` para simplificar o uso comum.
 */
export interface PakiNavigationRailItem {
  /** Identificador emitido em `itemSelected`; deve ser único na lista. */
  id: string;
  /** Nome exibido e usado como nome acessível no estado recolhido. */
  label: string;
  /** Rota opcional; quando presente, o item navega via RouterLink. */
  route?: string;
  /** Classe CSS do ícone; os glifos ficam a cargo da aplicação consumidora. */
  icon?: string;
  /** Quando verdadeiro, o item não navega e não emite `itemSelected`. */
  disabled?: boolean;
  /** Agrupa o item no topo (`main`) ou ancorado ao rodapé (`footer`). */
  position?: 'main' | 'footer';
}

/**
 * Cabeçalho de marca do rail.
 *
 * Sem `route` o cabeçalho não é navegável, por simetria com os itens.
 */
export interface PakiNavigationRailBrand {
  /** Texto da marca exibido no cabeçalho. */
  label: string;
  /** Rota opcional; quando presente, o cabeçalho navega ao ser acionado. */
  route?: string;
}

/**
 * Faixa de navegação vertical recolhível, acessível e temática.
 *
 * Entrega estados recolhido (64px) e expandido (216px) por two-way
 * `expanded`/`expandedChange`, itens com rota opcional, item de rodapé e
 * cabeçalho de marca. O componente não persiste estado; a decisão de
 * persistência é do consumidor.
 */
@Component({
  selector: 'paki-navigation-rail',
  standalone: true,
  // RouterLink e RouterLinkActive já entram nos imports porque as próximas
  // tarefas renderizam itens com rota e destaque de rota ativa no template.
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './paki-navigation-rail.html',
  styleUrl: './paki-navigation-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.paki-navigation-rail--expanded]': 'expanded()',
  },
})
export class PakiNavigationRail {
  /** Estado recolhido/expandido controlado pelo consumidor; inicia recolhido. */
  readonly expanded = model(false);

  /** Lista de itens de navegação; padrão vazio evita erro em estado inicial. */
  readonly items = input<readonly PakiNavigationRailItem[]>([]);

  /** Cabeçalho de marca opcional. */
  readonly brand = input<PakiNavigationRailBrand | undefined>(undefined);

  /** Emite o `id` do item selecionado; suprimido quando o item é `disabled`. */
  readonly itemSelected = output<string>();

  /** Itens do grupo principal: `position` ausente conta como `main`. */
  readonly mainItems = computed(() =>
    this.items().filter((item) => item.position === undefined || item.position === 'main'),
  );

  /** Itens ancorados ao rodapé, separados visualmente do grupo principal. */
  readonly footerItems = computed(() =>
    this.items().filter((item) => item.position === 'footer'),
  );
}
