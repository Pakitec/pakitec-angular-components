import { Directive, ElementRef, HostListener, effect, inject, input } from '@angular/core';

export type PakiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type PakiButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[pakiButton], a[pakiButton]',
  host: {
    class: 'paki-button',
    '[class]': '"paki-button paki-button--" + variant() + " paki-button--" + size()',
    '[class.paki-button--loading]': 'loading()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'loading() ? "true" : null',
    '[attr.tabindex]': 'loading() ? "-1" : null',
  },
})
export class PakiButton {
  private readonly element = inject(ElementRef<HTMLElement>);
  private wasLoading = false;
  private disabledBeforeLoading = false;

  readonly variant = input<PakiButtonVariant>('primary');
  readonly size = input<PakiButtonSize>('md');
  readonly loading = input(false);

  constructor() {
    effect(() => {
      const loading = this.loading();
      if (loading === this.wasLoading) return;

      const element = this.element.nativeElement;
      if (element.tagName === 'BUTTON') {
        const button = element as HTMLButtonElement;
        if (loading) {
          this.disabledBeforeLoading = button.disabled;
          button.disabled = true;
        } else {
          button.disabled = this.disabledBeforeLoading;
        }
      }
      this.wasLoading = loading;
    });
  }

  @HostListener('click', ['$event'])
  protected preventClickWhileLoading(event: Event): void {
    if (!this.loading()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
