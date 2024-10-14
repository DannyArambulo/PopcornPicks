import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeSetupComponent } from './first-time-setup.component';

describe('FirstTimeSetupComponent', () => {
  let component: FirstTimeSetupComponent;
  let fixture: ComponentFixture<FirstTimeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimeSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTimeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
