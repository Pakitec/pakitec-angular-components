import { TestBed } from '@angular/core/testing';
import { PakiSwitch } from './paki-switch';
describe('PakiSwitch', () => {
  it('toggles its checked model', async () => {
    await TestBed.configureTestingModule({ imports: [PakiSwitch] }).compileComponents();
    const fixture = TestBed.createComponent(PakiSwitch);
    fixture.componentRef.setInput('label', 'Ativar');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(fixture.componentInstance.checked()).toBe(true);
  });
});
