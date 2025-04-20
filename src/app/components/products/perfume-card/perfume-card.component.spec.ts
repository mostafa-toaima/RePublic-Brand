import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeCardComponent } from './perfume-card.component';

describe('PerfumeCardComponent', () => {
  let component: PerfumeCardComponent;
  let fixture: ComponentFixture<PerfumeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfumeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfumeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
