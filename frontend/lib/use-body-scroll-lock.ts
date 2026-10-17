"use client";

import { useEffect } from "react";

const lockedBodyProperties = [
  "position",
  "top",
  "left",
  "right",
  "width",
  "overflow",
  "padding-right",
] as const;

let lockCount = 0;
let savedScrollY = 0;
let savedRootOverflow = { value: "", priority: "" };
let savedBodyStyles: Array<{ property: string; value: string; priority: string }> = [];

function acquireBodyScrollLock() {
  const root = document.documentElement;
  const body = document.body;

  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    savedRootOverflow = {
      value: root.style.getPropertyValue("overflow"),
      priority: root.style.getPropertyPriority("overflow"),
    };
    savedBodyStyles = lockedBodyProperties.map((property) => ({
      property,
      value: body.style.getPropertyValue(property),
      priority: body.style.getPropertyPriority(property),
    }));

    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("position", "fixed", "important");
    body.style.setProperty("top", `-${savedScrollY}px`, "important");
    body.style.setProperty("left", "0", "important");
    body.style.setProperty("right", "0", "important");
    body.style.setProperty("width", "100%", "important");
    body.style.setProperty("overflow", "hidden", "important");

    if (scrollbarWidth > 0) {
      body.style.setProperty(
        "padding-right",
        `calc(${window.getComputedStyle(body).paddingRight} + ${scrollbarWidth}px)`,
        "important",
      );
    }
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) {
      return;
    }
    released = true;
    lockCount -= 1;

    if (lockCount !== 0) {
      return;
    }

    if (savedRootOverflow.value) {
      root.style.setProperty("overflow", savedRootOverflow.value, savedRootOverflow.priority);
    } else {
      root.style.removeProperty("overflow");
    }
    savedBodyStyles.forEach(({ property, value, priority }) => {
      if (value) {
        body.style.setProperty(property, value, priority);
      } else {
        body.style.removeProperty(property);
      }
    });

    const scrollBehavior = root.style.getPropertyValue("scroll-behavior");
    const scrollBehaviorPriority = root.style.getPropertyPriority("scroll-behavior");
    root.style.setProperty("scroll-behavior", "auto", "important");
    window.scrollTo(0, savedScrollY);
    if (scrollBehavior) {
      root.style.setProperty("scroll-behavior", scrollBehavior, scrollBehaviorPriority);
    } else {
      root.style.removeProperty("scroll-behavior");
    }
  };
}

export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    return acquireBodyScrollLock();
  }, [enabled]);
}
