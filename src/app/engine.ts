import {
  ChangeDetectorRef,
  Injectable,
  StaticProvider,
  ViewRef,
  inject
} from '@angular/core';
import { Promise } from '@rx-angular/cdk/zone-less/browser';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { ReplaySubject } from 'rxjs';

export function describeEngine<T extends object>(initialState?: Partial<T>) {
  const injectEngine = (): RxEngine<T> => {
    return inject(RxEngine, {
      self: true
    });
  };
  const provideEngine = (): StaticProvider => {
    return {
      provide: RxEngine,
      useFactory: () => {
        const cdRef = inject(ChangeDetectorRef);
        return new RxEngine(cdRef, initialState);
      },
    };
  };
  return { injectEngine, provideEngine };
}

@Injectable()
export class RxEngine<T extends object> {
  private readonly strategyProvider = inject(RxStrategyProvider);
  private readonly renderSubject = new ReplaySubject<void>(1);

  readonly vm: T;

  constructor(
    private cdRef: ChangeDetectorRef,
    private initialState?: Partial<T>
  ) {
    cdRef.detach();
    const renderSubject = this.renderSubject;
    this.vm = new Proxy<T>({ ...initialState } as T, {
      get(target, prop, receiver) {
        // @ts-ignore
        return target[prop];
      },
      set(target: T, p: string | symbol, value: any, receiver: any): boolean {
        // @ts-ignore
        target[p] = value;
        renderSubject.next();
        return true;
      },
    });
    if (initialState) {
      renderSubject.next();
    }
    // hack to wait for NgOnInit ... not a cool solution
    Promise.resolve().then(() => {
      const sub = this.renderSubject
        .pipe(
          this.strategyProvider.scheduleWith(
            () => {
              this.cdRef.detectChanges();
            },
            {
              scope: (this.cdRef as any).context,
            }
          )
        )
        .subscribe();
      (cdRef as ViewRef).onDestroy(() => {
        sub.unsubscribe();
      });
    });
  }
}
