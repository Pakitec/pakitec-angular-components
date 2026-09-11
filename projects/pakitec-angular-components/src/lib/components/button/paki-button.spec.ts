import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PakiButton } from './paki-button';

@Component({
  imports: [PakiButton],
  template: '<button pakiButton variant="secondary" [loading]="loading">Salvar</button>',
})
class Host { loading = false; }
describe('PakiButton', () => {
  it('applies its variant', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').classList).toContain(
      'paki-button--secondary',
    );
  });

  it('blocks new clicks while loading', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.loading = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    let clicks = 0;
    button.addEventListener('click', () => clicks++);
    button.click();
    expect(button.classList).toContain('paki-button--loading');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
    expect(clicks).toBe(0);
  });
});
