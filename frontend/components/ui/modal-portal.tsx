"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = React.ComponentProps<"div">;

export function ModalPortal({ children, ...props }: ModalPortalProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const portal = portalRef.current;
    const dialog = portal?.firstElementChild as HTMLElement | null;
    if (!portal || !dialog) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.tabIndex = -1;

    const title = dialog.querySelector<HTMLElement>("h1, h2, h3, h4, [role='heading']");
    if (title) {
      if (!title.id) {
        title.id = `${titleId}-title`;
      }
      dialog.setAttribute("aria-labelledby", title.id);
    }

    const firstButton = dialog.querySelector<HTMLButtonElement>("button");
    if (firstButton && !firstButton.getAttribute("aria-label") && !firstButton.textContent?.trim()) {
      firstButton.setAttribute("aria-label", "Close dialog");
    }

    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const closeButton =
          dialog.querySelector<HTMLButtonElement>(
            "button[aria-label*='close' i], button[title*='close' i]",
          ) ??
          Array.from(dialog.querySelectorAll<HTMLButtonElement>("button")).find(
            (button) => button.textContent?.trim().toLowerCase() === "close",
          );
        if (closeButton) {
          event.preventDefault();
          closeButton.click();
        }
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    const closeButton =
      dialog.querySelector<HTMLButtonElement>(
        "button[aria-label*='close' i], button[title*='close' i]",
      ) ??
      Array.from(dialog.querySelectorAll<HTMLButtonElement>("button")).find(
        (button) => button.textContent?.trim().toLowerCase() === "close",
      );
    const initialFocus = closeButton ?? getFocusableElements()[0] ?? dialog;
    initialFocus.focus({ preventScroll: true });
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [titleId]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div {...props} ref={portalRef}>
      {children}
    </div>,
    document.body,
  );
}
