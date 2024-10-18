import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountinfoComponent } from './accountinfo.component';

describe('AccountinfoComponent', () => {
  let component: AccountinfoComponent;
  let fixture: ComponentFixture<AccountinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
