import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PakitecAngularComponents } from './pakitec-angular-components';

describe('PakitecAngularComponents', () => {
  let component: PakitecAngularComponents;
  let fixture: ComponentFixture<PakitecAngularComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PakitecAngularComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(PakitecAngularComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
