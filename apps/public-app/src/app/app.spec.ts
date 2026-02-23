import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { APP_VERSION } from './app-version';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterModule.forRoot([])],
      providers: [{ provide: APP_VERSION, useValue: 'test' }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
