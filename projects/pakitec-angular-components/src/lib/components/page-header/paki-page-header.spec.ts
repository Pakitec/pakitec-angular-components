import { TestBed } from '@angular/core/testing';
import { PakiPageHeader } from './paki-page-header';
describe('PakiPageHeader', () => {
  it('renders its title', async () => {
    await TestBed.configureTestingModule({ imports: [PakiPageHeader] }).compileComponents();
    const fixture = TestBed.createComponent(PakiPageHeader);
    fixture.componentRef.setInput('title', 'Tutores');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Tutores');
  });
});
