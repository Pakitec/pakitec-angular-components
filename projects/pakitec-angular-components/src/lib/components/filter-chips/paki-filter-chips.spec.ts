import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PakiFilterChips } from './paki-filter-chips';

@Component({
  imports: [PakiFilterChips],
  template: `<paki-filter-chips [options]="options" [multiple]="multiple()" [(selected)]="selected" />`,
})
class Host {
  readonly options = [{ value: 'open', label: 'Abertos', count: 5 }, { value: 'done', label: 'Resolvidos' }];
  readonly multiple = signal(false);
  readonly selected = signal<readonly string[]>([]);
}

describe('PakiFilterChips', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const buttons = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('button'));
    return { fixture, buttons };
  }

  it('seleciona um valor por vez e desmarca no segundo clique', async () => {
    const { fixture, buttons } = await setup();
    buttons()[0]!.click();
    buttons()[1]!.click();
    expect(fixture.componentInstance.selected()).toEqual(['done']);
    buttons()[1]!.click();
    expect(fixture.componentInstance.selected()).toEqual([]);
  });

  it('aceita várias seleções e expõe aria-pressed e contagem', async () => {
    const { fixture, buttons } = await setup();
    fixture.componentInstance.multiple.set(true);
    fixture.detectChanges();
    buttons()[0]!.click();
    buttons()[1]!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toEqual(['open', 'done']);
    expect(buttons()[0]!.getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[0]!.textContent).toContain('5');
  });
});
