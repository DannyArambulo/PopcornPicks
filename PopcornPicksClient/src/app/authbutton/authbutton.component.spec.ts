import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthbuttonComponent } from './authbutton.component';

describe('AuthbuttonComponent', () => {
  let component: AuthbuttonComponent;
  let fixture: ComponentFixture<AuthbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
