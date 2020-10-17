import { watch, reactive } from "vue";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import iconUrl from "leaflet/dist/images/marker-icon.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"

export const debounce = (fn, time) => {
  let timeout;

  return function (...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(context, args);
      timeout = null;
    }, time);
  };
};

export const capitalizeFirstLetter = (string) => {
  if (!string || typeof string.charAt !== "function") {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const propsBinder = (methods, leafletElement, props, setOptions) => {
  for (const key in props) {
    const setMethodName = "set" + capitalizeFirstLetter(key);
    if (methods[setMethodName]) {
      watch(
        () => props[key],
        (newVal, oldVal) => {
          methods[setMethodName](newVal, oldVal);
        }
      );
    } else if (setMethodName === "setOptions") {
      watch(
        () => props[key],
        (newVal) => {
          setOptions(leafletElement, newVal);
        }
      );
    } else if (leafletElement[setMethodName]) {
      watch(
        () => props[key],
        (newVal) => {
          leafletElement[setMethodName](newVal);
        }
      );
    }
  }
};

export const remapEvents = (onEvent) => {
  const result = {};
  for (const eventName in onEvent) {
    if (eventName !== "modelValue" && !eventName.startsWith("onUpdate")) {
      const newName = eventName.replace("on", "").toLowerCase();
      result[newName] = onEvent[eventName];
    }
  }
  return result;
};

export const resetWebpackIcon = (Icon) => {
  delete Icon.Default.prototype._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
};

export const generatePlaceholderMethods = (methods) => {
  const base = reactive({});
  return methods.reduce((acc, curr) => {
    acc[curr] = () =>
      console.warn(`Method ${curr} has been invoked without being replaced`);
    return acc;
  }, base);
};
