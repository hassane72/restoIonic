import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AjouterMenuPage } from './ajouter-menu.page';

describe('AjouterMenuPage', () => {
  let component: AjouterMenuPage;
  let fixture: ComponentFixture<AjouterMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AjouterMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
