declare module 'aos' {
  export interface AosOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
    delay?: number;
    anchor?: string;
    anchorPlacement?: string;
    disable?: boolean | 'phone' | 'tablet' | 'mobile' | (() => boolean);
    startEvent?: string;
    animatedClassName?: string;
    initClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    throttleDelay?: number;
    debounceDelay?: number;
  }

  const AOS: {
    init(options?: AosOptions): void;
    refresh(initialize?: boolean): void;
    refreshHard(): void;
  };

  export default AOS;
}

declare module 'aos/dist/aos.css';

