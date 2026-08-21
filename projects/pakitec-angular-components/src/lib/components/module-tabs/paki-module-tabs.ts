import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface PakiModuleTab {
  label: string;
  route: string;
}

@Component({
  selector: 'paki-module-tabs',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './paki-module-tabs.html',
  styleUrl: './paki-module-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiModuleTabs {
  readonly label = input('Navegação do módulo');
  readonly tabs = input.required<readonly PakiModuleTab[]>();
}
