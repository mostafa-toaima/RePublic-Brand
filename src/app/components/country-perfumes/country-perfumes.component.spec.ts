import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPerfumesComponent } from './country-perfumes.component';

describe('CountryPerfumesComponent', () => {
  let component: CountryPerfumesComponent;
  let fixture: ComponentFixture<CountryPerfumesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryPerfumesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryPerfumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
