# Handlers

## Creating a Handler

It's incredibly simple to create a custom handler!

{% hint style='info' %}
We highly recommend you write your Handler in TypeScript to take advantage of our documentation!
{% endhint %}

{% code-tabs %}
{% code-tabs-item title="TypeScript" %}
```typescript
import { Handler } from '@salte-auth/salte-auth';

export class IFrame extends Handler {
  get name(): string {
    return 'iframe';
  }

  // This determines whether the handler supports being automatically triggered
  // Handlers that require user input such as '@salte-auth/tab' 
  // and '@salte-auth/popup' don't support this.
  get auto(): boolean {
    return true;
  }

  connected({ handler }: Handler.ConnectedOptions) {
    if (handler !== this.$name || window.self === window.top) return;

    const iframe = parent.document.querySelector('body > iframe[owner="salte-auth"]');

    parent.document.body.removeChild(iframe);
  }

  open({ url, visible = true }: IFrame.OpenOptions): Promise<any> {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('owner', 'salte-auth');

    if (visible) {
      Object.assign(iframe.style, {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',
        zIndex: 9999,
        border: 'none',

        opacity: 0,
        transition: '0.5s opacity'
      });

      setTimeout(() => iframe.style.opacity = '1');
    } else {
      iframe.style.display = 'none';
    }
    
    iframe.src = url;
    document.body.appendChild(iframe);
    return new Promise((resolve) => {
      iframe.addEventListener('DOMNodeRemoved', () => {
        const parsed = this.parse(iframe.contentWindow.location);

        setTimeout(() => resolve(parsed));
      }, { passive: true });
    });
  }
}

export declare namespace IFrame {
  export interface OpenOptions extends Handler.OpenOptions {
    visible?: boolean
  }
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="JavaScript" %}
```javascript
import { Handler } from '@salte-auth/salte-auth';

export class IFrame extends Handler {
  get name() {
    return 'iframe';
  }

  // This determines whether the handler supports being automatically triggered
  // Handlers that require user input such as '@salte-auth/tab' 
  // and '@salte-auth/popup' don't support this.
  get auto(): boolean {
    return true;
  }

  connected({ handler }) {
    if (handler !== this.$name || window.self === window.top) return;

    const iframe = parent.document.querySelector('body > iframe[owner="salte-auth"]');

    parent.document.body.removeChild(iframe);
  }

  open({ url, visible = true }) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('owner', 'salte-auth');

    if (visible) {
      Object.assign(iframe.style, {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',
        zIndex: 9999,
        border: 'none',

        opacity: 0,
        transition: '0.5s opacity'
      });

      setTimeout(() => iframe.style.opacity = '1');
    } else {
      iframe.style.display = 'none';
    }
    
    iframe.src = url;
    document.body.appendChild(iframe);
    return new Promise((resolve) => {
      iframe.addEventListener('DOMNodeRemoved', () => {
        const parsed = this.parse(iframe.contentWindow.location);

        setTimeout(() => resolve(parsed));
      }, { passive: true });
    });
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
