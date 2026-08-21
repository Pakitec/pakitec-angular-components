import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PakiButton } from './paki-button';

@Component({
  imports: [PakiButton],
  template: '<button pakiButton variant="secondary">Salvar</button>',
})
class Host {}
describe('PakiButton', () => {
  it('applies its variant', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').classList).toContain(
      'paki-button--secondary',
    );
  });
});
