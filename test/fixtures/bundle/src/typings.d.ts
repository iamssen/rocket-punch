declare module '*.txt' {
  const content: string;
  export = content;
}

declare module '*.md' {
  const content: string;
  export = content;
}

declare module '*.jpg' {
  const content: string;
  export = content;
}

declare module '*.jpeg' {
  const content: string;
  export = content;
}

declare module '*.png' {
  const content: string;
  export = content;
}

declare module '*.gif' {
  const content: string;
  export = content;
}

declare module '*.webp' {
  const content: string;
  export = content;
}

declare module '*.svg' {
  import { ReactComponent } from 'react';
  const content: ReactComponent;
  export = content;
}