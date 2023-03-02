import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueeningBoxComponent } from './queening-box.component';

describe('QueeningBoxComponent', () => {
  let component: QueeningBoxComponent;
  let fixture: ComponentFixture<QueeningBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueeningBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueeningBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
